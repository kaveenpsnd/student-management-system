function LoadingSpinner({ size = "medium", text = "Loading..." }) {
  const sizes = {
    small: { spinner: "w-6 h-6", text: "text-xs" },
    medium: { spinner: "w-10 h-10", text: "text-sm" },
    large: { spinner: "w-16 h-16", text: "text-base" },
  }

  const sizeClass = sizes[size] || sizes.medium

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div
        className={`${sizeClass.spinner} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
        style={{ animationDuration: "0.8s" }}
      ></div>
      {text && <p className={`mt-4 text-gray-600 ${sizeClass.text}`}>{text}</p>}
    </div>
  )
}

export default LoadingSpinner

