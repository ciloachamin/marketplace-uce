export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col items-center justify-center space-y-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Espera mientras se carga los resultados</h3>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 bg-emerald-500 rounded-full"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.12}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

// CSS global para animaciones adicionales
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .loader-bar {
    width: 100%;
    animation: loaderBar 1.5s infinite;
  }
  
  @keyframes loaderBar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .delay-150 {
    animation-delay: 150ms;
  }
  
  .delay-300 {
    animation-delay: 300ms;
  }
  
  .delay-500 {
    animation-delay: 500ms;
  }
`;
document.head.appendChild(style);