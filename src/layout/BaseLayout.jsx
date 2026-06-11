import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import UnitsToggle from '../components/UnitsToggle';
import useInitialLocation from '../features/weather/useInitialLocation';
import useAlerts from '../features/alerts/useAlerts';

const NAV_ITEMS = [
  { path: '/', label: 'Forecast', icon: 'lni-cloudy-sun' },
  { path: '/map', label: 'Map', icon: 'lni-map-marker' },
  { path: '/alerts', label: 'Alerts', icon: 'lni-alarm' },
];

export default function BaseLayout() {
  useInitialLocation();
  const { pathname } = useLocation();
  const { alerts } = useAlerts();

  const currentTab =
    NAV_ITEMS.find((item) => item.path !== '/' && pathname.startsWith(item.path))
      ?.path ?? '/';

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="span" sx={{ fontSize: 26 }}>
              🌙
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              Weather App
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <SearchBar />
          <UnitsToggle />
        </Toolbar>
        <Tabs
          value={currentTab}
          textColor="inherit"
          sx={{
            px: 2,
            '& .MuiTabs-indicator': { backgroundColor: 'secondary.main' },
            '& .MuiTab-root': { minHeight: 48 },
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Tab
              key={item.path}
              value={item.path}
              component={RouterLink}
              to={item.path}
              iconPosition="start"
              icon={
                item.path === '/alerts' ? (
                  <Badge
                    badgeContent={alerts.length}
                    color="error"
                    sx={{ '& .MuiBadge-badge': { right: -4 } }}
                  >
                    <i className={`lni ${item.icon}`} />
                  </Badge>
                ) : (
                  <i className={`lni ${item.icon}`} />
                )
              }
              label={item.label}
            />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
