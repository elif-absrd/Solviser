import React from "react";

interface QuickActionsProps {
  onNewContract: () => void;
  onImportContract: () => void;
}

export default function QuickActions({ onNewContract, onImportContract }: QuickActionsProps) {
  const actionsRow1 = [
    {
      id: "newContract",
      title: "New Smart Contract",
      icon: "📄",
      onClick: onNewContract
    },
    {
      id: "importContract",
      title: "Import Smart Contract",
      icon: "�",
      onClick: onImportContract
    },
    {
      id: "uploadContract", 
      title: "Upload Contract Document",
      icon: "�",
      onClick: () => alert("Upload contract feature coming soon!")
    },
    {
      id: "viewRiskReport",
      title: "View Risk Report", 
      icon: "�",
      onClick: () => alert("Risk report feature coming soon!")
    },
    {
      id: "downloadReport",
      title: "Download All Contracts Report",
      icon: "�", 
      onClick: () => alert("Download report feature coming soon!")
    }
  ];

  const actionsRow2 = [
    {
      id: "notifyBuyer",
      title: "Notify Buyer",
      icon: "🔔",
      onClick: () => alert("Notify buyer feature coming soon!")
    },
    {
      id: "renewContract",
      title: "Renew Contract", 
      icon: "🔄",
      onClick: () => alert("Contract renewal feature coming soon!")
    },
    {
      id: "reportDispute",
      title: "Report Dispute",
      icon: "⚠️", 
      onClick: () => alert("Dispute reporting feature coming soon!")
    },
    {
      id: "exportAnalytics",
      title: "Export Contract Analytics",
      icon: "📈",
      onClick: () => alert("Analytics export feature coming soon!")
    }
  ];

  return (
    <>
      <style jsx>{`
        .action-buttons-container {
          border-radius: 8px;
          background-color: #F05134;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          padding: 24px;
        }

        @media (max-width: 991px) {
          .action-buttons-container {
            max-width: 100%;
            padding: 16px;
          }
        }

        .action-buttons-row {
          display: flex;
          align-items: stretch;
          gap: 20px;
          justify-content: space-between;
        }

        .action-buttons-row + .action-buttons-row {
          margin-top: 20px;
        }

        .action-button {
          border-radius: 8px;
          background-color: #FFFFFF;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 24px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
        }

        .action-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .action-text {
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
        }

        @media (max-width: 991px) {
          .action-buttons-row {
            flex-direction: column;
            gap: 12px;
          }
          
          .action-button {
            padding: 20px 12px;
          }

          .action-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .action-text {
            font-size: 13px;
          }
        }

        @media (max-width: 640px) {
          .action-buttons-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
      
      <div className="action-buttons-container">
        {/* First Row */}
        <div className="action-buttons-row">
          {actionsRow1.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="action-button"
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Second Row */}
        <div className="action-buttons-row">
          {actionsRow2.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="action-button"
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}