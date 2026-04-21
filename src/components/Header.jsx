import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetFilters } from '../store/filtersSlice';

function Header() {
  const dispatch = useDispatch();

  const handleLogoClick = () => {
    dispatch(resetFilters());
  };

  return (
    <header className="main-header">
      <Link to="/songs" className="logo-container" onClick={handleLogoClick}>
        <h2 className="logo-text">Lyricist</h2>
      </Link>
    </header>
  );
}

export default Header;
