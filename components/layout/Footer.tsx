import { APP_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 py-4">
        <div className="flex justify-end items-center">
          <p className="text-xs text-gray-500">Version {APP_INFO.version}</p>
        </div>
      </div>
    </footer>
  );
}
