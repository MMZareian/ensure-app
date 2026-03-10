/**
 * RAG (Red/Amber/Green) Status Banner
 */

interface RagBannerProps {
  score: number;
}

export function RagBanner({ score }: RagBannerProps) {
  const getStatus = (score: number) => {
    if (score >= 75) {
      return {
        cls: 'green',
        label: 'On Track',
        msg: `Average classification accuracy of ${score}% — performing above threshold.`,
      };
    } else if (score >= 60) {
      return {
        cls: 'amber',
        label: 'Needs Attention',
        msg: `Average classification accuracy of ${score}% — some energy types need improvement.`,
      };
    } else {
      return {
        cls: 'red',
        label: 'Action Required',
        msg: `Average classification accuracy of ${score}% — significant gaps in hazard classification.`,
      };
    }
  };

  const status = getStatus(score);

  return (
    <div className={`rag-banner ${status.cls}`}>
      <div className="rag-dot" />
      <div>
        <strong>{status.label}:</strong> {status.msg}
      </div>
    </div>
  );
}
