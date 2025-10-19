const Notification = ({ message = '', type = 'info', onClose }) => {
  const backgroundColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${backgroundColor} text-white custom-shadow-neon z-50`}
    >
      <p className="text-sm font-medium">{String(message)}</p>
      <button
        onClick={onClose}
        className="ml-2 font-bold text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
