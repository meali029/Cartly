import ScrollToTop from '../ui/ScrollToTop'
import ScrollToTopButton from '../ui/ScrollToTopButton'

/**
 * ScrollManager - A comprehensive scroll management component
 * This component provides both auto-scroll on route changes and a manual scroll-to-top button
 */
const ScrollManager = ({
  // ScrollToTop props
  autoScrollOnRouteChange = true,
  
  // ScrollToTopButton props
  showButton = true,
  threshold = 300,
  smooth = true,
  showProgress = true,
  size = 'md',
  position = 'bottom-right',
  className = ''
}) => {
  return (
    <>
      {/* Auto scroll to top on route changes */}
      {autoScrollOnRouteChange && <ScrollToTop />}
      
      {/* Manual scroll to top button */}
      {showButton && (
        <ScrollToTopButton
          threshold={threshold}
          smooth={smooth}
          showProgress={showProgress}
          size={size}
          position={position}
          className={className}
        />
      )}
    </>
  )
}

export default ScrollManager
