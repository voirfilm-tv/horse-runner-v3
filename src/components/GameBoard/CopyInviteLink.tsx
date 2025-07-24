import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function CopyInviteLink() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = window.location.origin + '/game/' + id;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!id) return null;

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600 mb-2">Inviter un ami dans cette partie :</p>
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        {copied ? '✅ Lien copié !' : '📋 Copier le lien'}
      </button>
    </div>
  );
}