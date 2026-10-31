import { useDirectory } from '../DirectoryContext.jsx';
import { useAppLocation } from '../LocationContext.jsx';

export default function DataBanner() {
  const { location } = useAppLocation();
  const d = useDirectory();
  if (d.status === 'loading') return <p className="databar" role="status">Loading places for {location.name} from OpenStreetMap...</p>;
  if (d.status === 'error') return (
    <p className="databar err" role="alert">Could not load live data: {d.error} Showing clearly labelled demo records instead.{' '}
      <button className="chip" onClick={d.retry}>Retry</button></p>);
  const when = d.fetchedAt ? new Date(d.fetchedAt).toLocaleDateString() : '';
  return (
    <p className="databar" role="status">
      {d.usingDemo ? 'No OpenStreetMap places were found, so demo records are shown. ' : ''}
      Places come from OpenStreetMap contributors within about {d.radiusKm} km of the centre of {location.name}{when ? ` (fetched ${when})` : ''}.
      Coverage is incomplete{d.capped ? `, and only the first ${d.max} results are shown` : ''}. Details are not verified by Atti Spot.
    </p>
  );
}
