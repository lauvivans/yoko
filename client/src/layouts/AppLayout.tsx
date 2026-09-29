import Footer from '@/layouts/components/Footer';
import Header from '@/layouts/components/Header';
import { Link, Outlet } from 'react-router';
import ClockIcon from '@/components/display/icons/views/Clock';
import navigation from '@/navigation';
import TaskIcon from '@/components/display/icons/features/Task';
import NoteIcon from '@/components/display/icons/features/Note';
import MoodHistoryIcon from '@/components/display/icons/features/Mood';
import SignInIcon from '@/components/display/icons/SignIn';
import SunnyIcon from '@/components/display/icons/day-period/Sunny';

const AppLayout = () => {
  return (
    <div className={`app light`}>
      <Header />
      <div className="app__main-wrapper">
        <div className="app__main-wrapper__outlet-wrapper">
          <aside className="app__main-wrapper__outlet-wrapper__aside">
            <ul className="app__main-wrapper__outlet-wrapper__aside__top">
              <li title="Home">
                <Link to="/">
                  <img src="/mascot.svg" />
                </Link>
              </li>
              <li title="Theme">
                {/* eslint-disable @typescript-eslint/no-empty-function */}
                <button
                  className="app__main-wrapper__outlet-wrapper__aside__top__theme"
                  type="button"
                  onClick={() => {}}
                  aria-label="Switch theme"
                >
                  <SunnyIcon />
                </button>
                {/* eslint-enable @typescript-eslint/no-empty-function */}
              </li>
            </ul>
            <ul className="app__main-wrapper__outlet-wrapper__aside__middle">
              <li title="Occurrences">
                <Link
                  aria-label="Go to occurrences"
                  to={navigation.navigateToOccurrences().pathname}
                >
                  <ClockIcon />
                </Link>
              </li>
              <li title="Notes">
                <Link aria-label="Go to notes" to="#">
                  <NoteIcon />
                </Link>
              </li>
              <li title="Tasks">
                <Link aria-label="Go to tasks" to="#">
                  <TaskIcon />
                </Link>
              </li>
              <li title="Mood history">
                <Link aria-label="Go to mood history" to="#">
                  <MoodHistoryIcon />
                </Link>
              </li>
            </ul>
            <ul className="app__main-wrapper__outlet-wrapper__aside__bottom">
              <li title="Sign in">
                {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                <button type="button" onClick={() => {}} aria-label="Sign in">
                  <SignInIcon />
                </button>
              </li>
            </ul>
          </aside>
          <div className="app__main-wrapper__outlet-wrapper__main">
            <div
              className="app__main-wrapper__outlet-wrapper__main__outlet"
              id="app-outlet"
            >
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
        <img src="/mascot.svg" />
      </div>
    </div>
  );
};

export default AppLayout;
