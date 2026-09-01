import { SOWSection, SectionStatus, SectionVersionSnapshot, AuditLogEntry, SOWProject } from '../types/quill';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
}

export interface ConcurrencyConflict {
  hasConflict: boolean;
  serverVersion: number;
  clientVersion: number;
  serverEditedBy: string;
  serverEditedAt: string;
  serverContent: string;
  clientContent: string;
}

export const concurrencyAndAuditService = {
  // QTK-027: State Machine transition validator
  isValidTransition(currentStatus: SectionStatus, nextStatus: SectionStatus): { isValid: boolean; errorReason?: string } {
    const validTransitions: Record<SectionStatus, SectionStatus[]> = {
      'Pending': ['Generating', 'Review'],
      'Generating': ['Review', 'Rejected'],
      'Review': ['Approved', 'Rejected', 'Generating'],
      'Approved': ['Review', 'Superseded'], // Note: editing an approved section transitions it back to Review
      'Rejected': ['Review', 'Generating', 'Pending'],
      'Superseded': [] // Terminal state for historical snapshot
    };

    const allowed = validTransitions[currentStatus] || [];
    if (allowed.includes(nextStatus)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      errorReason: `Illegal state transition from "${currentStatus}" to "${nextStatus}". Allowed target states: ${allowed.join(', ') || 'None'}`
    };
  },

  // QTK-029: Invalidate approval when approved content is modified
  handleSectionEdit(
    section: SOWSection, 
    newContent: string, 
    editorName: string = 'Nikhil'
  ): { updatedSection: SOWSection; auditLog: AuditLogEntry; wasApprovalInvalidated: boolean } {
    const isCurrentlyApproved = section.status === 'Approved';
    const isContentChanged = section.content.trim() !== newContent.trim();

    // Create a snapshot of the current state before applying edit
    const currentSnapshot: SectionVersionSnapshot = {
      version: section.version,
      timestamp: section.lastEditedAt || new Date().toISOString(),
      editedBy: section.lastEditedBy || editorName,
      status: isCurrentlyApproved ? 'Superseded' : section.status,
      content: section.content,
      approvalRationale: section.approvalRationale,
      confidenceScore: section.confidenceScore,
      etag: section.etag || `etag_${Date.now()}`
    };

    const updatedVersionHistory = [
      currentSnapshot,
      ...(section.versionHistory || [])
    ];

    const nextVersion = Number((section.version + 0.1).toFixed(1));
    const newEtag = `etag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const updatedSection: SOWSection = {
      ...section,
      content: newContent,
      previousContentSnapshot: section.content,
      version: nextVersion,
      lastEditedBy: editorName,
      lastEditedAt: new Date().toISOString(),
      etag: newEtag,
      versionHistory: updatedVersionHistory,
      // If approved, invalidate approval!
      status: isCurrentlyApproved ? 'Review' : section.status,
      approvedBy: isCurrentlyApproved ? undefined : section.approvedBy,
      approvedAt: isCurrentlyApproved ? undefined : section.approvedAt,
      requiresReapproval: isCurrentlyApproved && isContentChanged
    };

    const auditLog: AuditLogEntry = {
      id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      projectId: section.projectId,
      projectTitle: `Section ${section.order}: ${section.title}`,
      user: editorName,
      userEmail: 'nikhil@acme-transform.com',
      action: 'SECTION_EDITED',
      details: isCurrentlyApproved && isContentChanged
        ? `Edited previously approved section "${section.title}". Approval invalidated, version bumped to v${nextVersion}. Re-approval required before export.`
        : `Updated section "${section.title}" content (version bumped to v${nextVersion}).`,
      status: isCurrentlyApproved && isContentChanged ? 'WARNING' : 'SUCCESS',
      executionTimeMs: 45
    };

    return {
      updatedSection,
      auditLog,
      wasApprovalInvalidated: isCurrentlyApproved && isContentChanged
    };
  },

  // QTK-026: Compute visual text diff (simple word/line diff)
  computeDiff(oldText: string, newText: string): DiffLine[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diffLines: DiffLine[] = [];

    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        if (oldLine !== undefined) {
          diffLines.push({
            type: 'unchanged',
            content: oldLine,
            lineNumber: i + 1
          });
        }
      } else {
        if (oldLine !== undefined && newLine !== undefined) {
          diffLines.push({
            type: 'removed',
            content: oldLine,
            lineNumber: i + 1
          });
          diffLines.push({
            type: 'added',
            content: newLine,
            lineNumber: i + 1
          });
        } else if (oldLine !== undefined) {
          diffLines.push({
            type: 'removed',
            content: oldLine,
            lineNumber: i + 1
          });
        } else if (newLine !== undefined) {
          diffLines.push({
            type: 'added',
            content: newLine,
            lineNumber: i + 1
          });
        }
      }
    }

    return diffLines;
  },

  // QTK-030: Optimistic Concurrency check
  checkOptimisticConcurrency(
    clientSection: SOWSection, 
    serverSection: SOWSection
  ): ConcurrencyConflict {
    const isConflict = Boolean(
      clientSection.etag && 
      serverSection.etag && 
      clientSection.etag !== serverSection.etag &&
      clientSection.content !== serverSection.content
    );

    return {
      hasConflict: isConflict,
      serverVersion: serverSection.version,
      clientVersion: clientSection.version,
      serverEditedBy: serverSection.lastEditedBy,
      serverEditedAt: serverSection.lastEditedAt,
      serverContent: serverSection.content,
      clientContent: clientSection.content
    };
  },

  // Check if project can be exported (QTK-029: Export gate)
  canExportProject(project: SOWProject): { canExport: boolean; unapprovedSections: SOWSection[] } {
    const unapproved = project.sections.filter(s => s.status !== 'Approved' || s.requiresReapproval);
    return {
      canExport: unapproved.length === 0,
      unapprovedSections: unapproved
    };
  }
};
