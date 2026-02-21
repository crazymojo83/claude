import { GitHubCalendar } from 'react-github-calendar';

function ContribGraph() {
  // We use explicit theme object mapping to apply the custom CSS crimson
  // variables rather than the default GitHub green shades.
  // level 0 is empty, 1-4 are increasing intensity.
  const explicitTheme = {
    light: [
      '#171d27',                  // Level 0
      'rgba(220, 20, 60, 0.2)',   // Level 1
      'rgba(220, 20, 60, 0.5)',   // Level 2
      'rgba(220, 20, 60, 0.8)',   // Level 3
      'rgba(220, 20, 60, 1.0)',   // Level 4
    ],
    dark: [
      '#171d27',                  // Level 0
      'rgba(220, 20, 60, 0.2)',
      'rgba(220, 20, 60, 0.5)',
      'rgba(220, 20, 60, 0.8)',
      'rgba(220, 20, 60, 1.0)',
    ]
  };

  return (
    <div className="contrib-graph">
      <GitHubCalendar
        username="stevemojica"
        theme={explicitTheme}
        colorScheme="dark"
        blockSize={12}
        blockMargin={4}
        fontSize={14}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      />
    </div>
  )
}

export default ContribGraph
