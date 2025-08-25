import React, { useState } from 'react';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { Dashboard } from '../views/Dashboard';
import { SupplierRegistration } from '../views/SupplierRegistration';
import { DocumentsUpload } from '../views/DocumentsUpload';
import { PaymentsView } from '../views/PaymentsView';
import { DocumentsCenter } from '../views/DocumentsCenter';
import { AnnouncementsView } from '../views/AnnouncementsView';
import { FeedbackView } from '../views/FeedbackView';
import { ApproveDocuments } from '../views/ApproveDocuments';
import { SupplierConfiguration } from '../views/SupplierConfiguration';
import { SuppliersManagement } from '../views/SuppliersManagement';
import { SuppliersReview } from '../views/SuppliersReview';
import { AllDocuments } from '../views/AllDocuments';
import { PaymentsAdmin } from '../views/PaymentsAdmin';
import { FeedbackAdmin } from '../views/FeedbackAdmin';

export const MainPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'supplier-registration':
        return <SupplierRegistration />;
      case 'documents-upload':
        return <DocumentsUpload />;
      case 'payments':
        return <PaymentsView />;
      case 'documents':
        return <DocumentsCenter />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'feedback':
        return <FeedbackView />;
      case 'approve-documents':
        return <ApproveDocuments />;
      case 'configuration':
        return <SupplierConfiguration />;
      case 'suppliers-management':
        return <SuppliersManagement />;
      case 'suppliers-review':
        return <SuppliersReview />;
      case 'all-documents':
        return <AllDocuments />;
      case 'payments-admin':
        return <PaymentsAdmin />;
      case 'feedback-admin':
        return <FeedbackAdmin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neo-gray-50">
      <Navbar />
      <div className="flex relative">
        {/* Sidebar - Always visible */}
        <div className="relative z-30">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onCollapseChange={setSidebarCollapsed}
          />
        </div>
        
        {/* Main Content Area - Always visible and properly positioned */}
        <main className="flex-1 min-h-screen relative z-10">
          <div className="p-8 w-full">
            <div className="max-w-full">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};