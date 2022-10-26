import Toastify from 'toastify-js';

export const showToast = (message: string) => {
  const toast = Toastify({
    text: message,
    duration: 5000,
    close: true,
    stopOnFocus: true,
    style: {
      background: '#000000',
    },
    onClick: () => {
      toast.hideToast();
    },
  });
  toast.showToast();
};
