import { APP_INFO } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-600">
            © {currentYear} {APP_INFO.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">Version {APP_INFO.version}</p>
        </div>
      </div>
    </footer>
  );
}
