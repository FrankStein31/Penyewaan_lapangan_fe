/**
 * Fungsi utility untuk aplikasi
 */

/**
 * Format tanggal ke format yang diinginkan
 * @param {string|Date} date - Tanggal yang akan diformat
 * @param {object} options - Opsi formatting
 * @returns {string} - Tanggal yang sudah diformat
 */
export function formatDate(date, options = {}) {
  if (!date) return '-';
  
  const defaultOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    return new Date(date).toLocaleDateString('id-ID', mergedOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
}

/**
 * Format angka menjadi format mata uang
 * @param {number} amount - Jumlah yang akan diformat
 * @param {object} options - Opsi formatting
 * @returns {string} - Jumlah dalam format mata uang
 */
export function formatCurrency(amount, options = {}) {
  if (amount === null || amount === undefined) return 'Rp 0';
  
  const defaultOptions = { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.NumberFormat('id-ID', mergedOptions).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `Rp ${amount}`;
  }
} 