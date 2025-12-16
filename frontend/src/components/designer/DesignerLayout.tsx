import { Outlet } from 'react-router-dom';
import { DesignerSidebar } from './DesignerSidebar';

export function DesignerLayout() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DesignerSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
