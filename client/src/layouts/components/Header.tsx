import MoodIcon from '@/components/display/icons/Mood';
import SearchIcon from '@/components/display/icons/Search';
import { useRef } from 'react';

const Header = () => {
  const isMouseDown = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    isMouseDown.current = true;

    const rect = e.currentTarget.getBoundingClientRect();

    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.currentTarget.style.transition = 'none';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    isMouseDown.current = false;

    e.currentTarget.style.transition = 'top 0.3s ease-out, left 0.3s ease-out';
  };

  const handleDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMouseDown.current) return;

    const x = e.clientX - offset.current.x;
    const y = e.clientY - offset.current.y;

    e.currentTarget.style.left = `${x}px`;
    e.currentTarget.style.top = `${y}px`;
  };

  return (
    <header
      className="c-header scale-in-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleDrag}
      onMouseUp={handleMouseUp}
    >
      <div className="c-header__left-side">
        <span className="c-header__left-side__period">Good morning</span>
      </div>
      <div className="c-header__right-side">
        {/* eslint-disable @typescript-eslint/no-empty-function */}
        <button
          className="c-header__middle__search"
          type="button"
          onClick={() => {}}
          aria-label="Open mood selector"
          title="Mood selector"
        >
          <MoodIcon />
        </button>
        <button
          className="c-header__right-side__search"
          type="button"
          onClick={() => {}}
          aria-label="Search"
          title="Search"
        >
          <SearchIcon />
        </button>
        {/* eslint-enable @typescript-eslint/no-empty-function */}
      </div>
    </header>
  );
};

export default Header;
