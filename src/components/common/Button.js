import React from 'react';

/**
 * Komponen Tombol untuk penggunaan umum di seluruh aplikasi
 * @param {Object} props - Properti komponen
 * @param {string} props.text - Teks yang ditampilkan pada tombol
 * @param {string} props.type - Jenis tombol (primer, sekunder, bahaya)
 * @param {string} props.size - Ukuran tombol (kecil, sedang, besar)
 * @param {Function} props.onClick - Fungsi yang dipanggil saat tombol diklik
 * @param {boolean} props.disabled - Apakah tombol dinonaktifkan
 * @param {string} props.className - Kelas CSS tambahan
 * @param {React.ReactNode} props.children - Konten anak (opsional)
 * @param {React.ReactNode} props.leftIcon - Ikon di sebelah kiri teks
 * @param {React.ReactNode} props.rightIcon - Ikon di sebelah kanan teks
 */
const Button = ({
  text,
  type = 'primer',
  size = 'sedang',
  onClick,
  disabled = false,
  className = '',
  children,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Gaya dasar tombol
  const baseClasses = `
    inline-flex items-center justify-center 
    font-bold tracking-wider 
    rounded-full 
    transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    space-x-2
  `;

  // Gaya berdasarkan jenis tombol
  const typeClasses = {
    primer: `
      bg-blue-600 text-white 
      hover:bg-blue-700 hover:shadow-md 
      focus:ring-blue-500
    `,
    sekunder: `
      bg-gray-100 text-gray-700 
      hover:bg-gray-200 hover:text-gray-900 
      focus:ring-gray-400
    `,
    bahaya: `
      bg-red-600 text-white 
      hover:bg-red-700 hover:shadow-md 
      focus:ring-red-500
    `,
    outline: `
      border border-blue-600 text-blue-600 
      bg-transparent 
      hover:bg-blue-50 
      focus:ring-blue-300
    `
  };

  // Gaya berdasarkan ukuran tombol
  const sizeClasses = {
    kecil: 'px-3 py-1.5 text-sm',
    sedang: 'px-4 py-2 text-base',
    besar: 'px-6 py-3 text-lg',
    penuh: 'w-full px-4 py-2 text-base'
  };

  // Gaya untuk tombol yang dinonaktifkan
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:scale-[1.02] active:scale-[0.98]';

  // Gabungkan semua kelas
  const buttonClasses = `
    ${baseClasses} 
    ${typeClasses[type]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {text || children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;