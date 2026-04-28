import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './JobInfoTab.module.css';
import JobDetailPanel_SectionCard from '../common/JobDetailPanel_SectionCard';
import Badge from '../../../common/Badge/Badge';
import Button from '../../../common/Button/Button';
import { formatJobDescription } from '../../../../utils/formatJobDescription';
import { generateKeywords, updateJob } from '../../../../features/jobTracker/jobSlice';

const APPLICATION_STAGES = [
  { id: 'Bookmarked', label: 'Bookmarked' },
  { id: 'Applied', label: 'Applied' },
  { id: 'Interviewing', label: 'Interviewing' },
  { id: 'Accepted', label: 'Accepted' },
  { id: 'Ghosted', label: 'Ghosted' },
  { id: 'Closed', label: 'Closed' },
];

const toStageDateLabel = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB');
};

const toInputDateValue = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const JobInfoTab = ({ job, onOpenNotesTab }) => {
  const dispatch = useDispatch();
  const [showRaw, setShowRaw] = React.useState(false);
  const [editingStageId, setEditingStageId] = React.useState(null);
  const [editingDateValue, setEditingDateValue] = React.useState('');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = React.useState(false);

  if (!job) return null;

  const { dateSaved, deadline, parsedData, rawJobDescription } = job;
  const { summary, requirements, responsibilities, extractedKeywords = [] } = parsedData || {};

  const currentStatusIndex = APPLICATION_STAGES.findIndex((stage) => stage.id === job.status);

  const fallbackHistory = [
    dateSaved ? { status: 'Bookmarked', date: dateSaved } : null,
    job.dateApplied ? { status: 'Applied', date: job.dateApplied } : null,
    job.status && job.status !== 'Bookmarked'
      ? { status: job.status, date: job.updatedAt || new Date() }
      : null,
  ].filter(Boolean);

  const historySource = Array.isArray(job.statusHistory) && job.statusHistory.length > 0
    ? job.statusHistory
    : fallbackHistory;

  const statusDateMap = historySource.reduce((acc, item) => {
    if (!item?.status || !item?.date) return acc;
    const existingDate = acc[item.status] ? new Date(acc[item.status]) : null;
    const nextDate = new Date(item.date);

    if (Number.isNaN(nextDate.getTime())) return acc;

    if (!existingDate || Number.isNaN(existingDate.getTime()) || nextDate > existingDate) {
      acc[item.status] = item.date;
    }

    return acc;
  }, {});

  if (dateSaved) {
    statusDateMap.Bookmarked = dateSaved;
  }

  const handleStartDateEdit = (stageId) => {
    setEditingStageId(stageId);
    setEditingDateValue(toInputDateValue(statusDateMap[stageId]));
  };

  const handleCancelDateEdit = () => {
    setEditingStageId(null);
    setEditingDateValue('');
  };

  const handleSaveStageDate = (stageId) => {
    if (!job?._id || !editingDateValue) return;

    const selectedDate = new Date(`${editingDateValue}T12:00:00`);
    if (Number.isNaN(selectedDate.getTime())) return;

    const nextDateIso = selectedDate.toISOString();

    const nextStageDateMap = {
      ...statusDateMap,
      [stageId]: nextDateIso,
    };

    const updatedHistory = APPLICATION_STAGES
      .map((stage) => {
        const rawDate = nextStageDateMap[stage.id];
        if (!rawDate) return null;

        const parsedDate = new Date(rawDate);
        if (Number.isNaN(parsedDate.getTime())) return null;

        return {
          status: stage.id,
          date: parsedDate.toISOString(),
        };
      })
      .filter(Boolean);

    const jobData = { statusHistory: updatedHistory };

    if (stageId === 'Bookmarked') {
      jobData.dateSaved = nextDateIso;
    }

    if (stageId === 'Applied') {
      jobData.dateApplied = nextDateIso;
    }

    dispatch(updateJob({ id: job._id, jobData }));
    handleCancelDateEdit();
  };

  const handleGenerateKeywords = async () => {
    if (!job?._id || isGeneratingKeywords) return;

    setIsGeneratingKeywords(true);
    try {
      await dispatch(generateKeywords(job._id)).unwrap();
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <JobDetailPanel_SectionCard
          title="Dates"
          icon="📅"
          headerActions={
            <button className={styles.collapseBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          }
        >
          <div className={styles.datesGrid}>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>DATE SAVED</span>
              <span className={styles.dateValue}>
                {dateSaved ? new Date(dateSaved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>APPLICATION DEADLINE</span>
              <div className={styles.addDate}>
                <span className={styles.icon}>⏰</span>
                <span className={styles.linkText}>
                  {deadline ? new Date(deadline).toLocaleDateString() : 'Add Date'}
                </span>
              </div>
            </div>
          </div>
        </JobDetailPanel_SectionCard>

        <JobDetailPanel_SectionCard
          title="Job Description"
          icon="📄"
        >
          <div className={styles.description}>
            {summary && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>SUMMARY</h4>
                <p>{summary}</p>
              </div>
            )}

            {requirements && requirements.length > 0 && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>REQUIREMENTS</h4>
                <ul className={styles.bulletList}>
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {responsibilities && responsibilities.length > 0 && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>RESPONSIBILITIES</h4>
                <ul className={styles.bulletList}>
                  {responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.rawSection}>
              <button
                className={styles.readMore}
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? 'Hide Raw Description' : 'View Raw Job Description...'}
              </button>

              {showRaw && (
                <div className={styles.rawContent}>
                  {formatJobDescription(rawJobDescription) || 'No raw description available.'}
                </div>
              )}
            </div>
          </div>
        </JobDetailPanel_SectionCard>
      </div>

      <div className={styles.rightColumn}>
        <JobDetailPanel_SectionCard title="Application Status" icon="🎯">
          <div className={styles.statusTimelineWrap}>
            <select
              className={styles.statusSelect}
              value={job.status || 'Bookmarked'}
              onChange={(e) => {
                const nextStatus = e.target.value;
                if (!job?._id || nextStatus === job.status) return;
                dispatch(updateJob({ id: job._id, jobData: { status: nextStatus } }));
              }}
            >
              {APPLICATION_STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>

            <div className={styles.statusTimeline}>
              {APPLICATION_STAGES.map((stage, index) => {
                const isCurrent = index === currentStatusIndex;
                const isCompleted = currentStatusIndex >= 0 && index <= currentStatusIndex;
                const dateLabel = toStageDateLabel(statusDateMap[stage.id]);

                return (
                  <div key={stage.id} className={styles.timelineItem}>
                    <div className={styles.timelineRail}>
                      <span
                        className={`${styles.timelineDot} ${isCompleted ? styles.timelineDotActive : ''} ${isCurrent ? styles.timelineDotCurrent : ''}`}
                      />
                      {index < APPLICATION_STAGES.length - 1 && (
                        <span
                          className={`${styles.timelineLine} ${isCompleted ? styles.timelineLineActive : ''}`}
                        />
                      )}
                    </div>

                    <div className={styles.timelineContent}>
                      <span className={`${styles.timelineLabel} ${isCurrent ? styles.timelineLabelCurrent : ''}`}>
                        {stage.label}
                      </span>

                      {editingStageId === stage.id ? (
                        <div className={styles.timelineDateEditor}>
                          <input
                            className={styles.timelineDateInput}
                            type="date"
                            value={editingDateValue}
                            onChange={(e) => setEditingDateValue(e.target.value)}
                          />
                          <button
                            className={styles.timelineDateAction}
                            onClick={() => handleSaveStageDate(stage.id)}
                            disabled={!editingDateValue}
                            title="Save date"
                          >
                            ✓
                          </button>
                          <button
                            className={`${styles.timelineDateAction} ${styles.timelineDateActionCancel}`}
                            onClick={handleCancelDateEdit}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.timelineDateButton}
                          onClick={() => handleStartDateEdit(stage.id)}
                          title="Edit date"
                        >
                          {dateLabel || 'Add date'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </JobDetailPanel_SectionCard>

        <JobDetailPanel_SectionCard
          title="AI Extracted Keywords"
          icon="💡"
          variant="ai"
          headerActions={
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateKeywords}
              disabled={isGeneratingKeywords}
            >
              {isGeneratingKeywords ? 'Generating...' : extractedKeywords.length > 0 ? 'Regenerate Keywords' : 'Generate Keywords'}
            </Button>
          }
        >
          <p className={styles.aiInfo}>Highlighting crucial skills to include in your resume for this specific role.</p>
          <div className={styles.tagCloud}>
            {extractedKeywords.length > 0 ? (
              extractedKeywords.map((tag) => (
                <Badge key={tag} status="success" className={styles.keywordTag}>
                  {tag} <span className={styles.check}>✓</span>
                </Badge>
              ))
            ) : (
              <p>No keywords generated yet.</p>
            )}
          </div>
        </JobDetailPanel_SectionCard>

        <JobDetailPanel_SectionCard
          title="Insights & Notes"
          icon="📓"
        >
          {job.notes?.trim() ? (
            <div className={styles.noteContentWrap}>
              <p className={styles.noteContent}>{job.notes}</p>
              <Button variant="secondary" size="sm" block onClick={onOpenNotesTab}>Edit Note</Button>
            </div>
          ) : (
            <div className={styles.placeholderNote}>
              <p>Add notes about company culture, interview tips, or follow-up strategies here.</p>
              <Button variant="secondary" size="sm" block onClick={onOpenNotesTab}>Add Note</Button>
            </div>
          )}
        </JobDetailPanel_SectionCard>
      </div>
    </div>
  );
};

export default JobInfoTab;
