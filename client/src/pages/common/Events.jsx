import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Calendar } from 'lucide-react';

function Events() {
  return (
    <>
      <Helmet>
        <title>Events | Experio</title>
        <meta
          name="description"
          content="Upcoming and Past Events on Experio are displayed here, the page is still in construction"
        />
        <meta name="twitter:card" content={assets.eventsPageImage} />
        <meta name="twitter:title" content="Events | Experio" />
        <meta
          name="twitter:description"
          content="Upcoming and Past Events on Experio are displayed here, the page is still in construction"
        />
        <meta name="twitter:image" content={assets.eventsPageImage} />

        <meta property="og:title" content="Events | Experio" />
        <meta
          property="og:description"
          content="Upcoming and Past Events on Experio are displayed here, the page is still in construction"
        />
        <meta property="og:image" content={assets.eventsPageImage} />
        <meta property="og:url" content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}/events`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen text-slate-800 dark:text-gray-100 font-sans pb-20">
        <div className="pt-10 pb-6 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            {/* Small Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
            
            {/* Big Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-grad-start to-hero-grad-end">Events</span>
            </h1>
            
            {/* Small Description */}
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              Join live sessions, webinars, and mock interview contests to supercharge your career preparation.
            </p>

            {/* Long Description */}
            <div className="max-w-3xl mx-auto mt-8 text-left">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Event Page is Under Construction
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
                We're thrilled to let you know that something amazing is on the way! Our team is
                currently putting together a series of fantastic events just for you. We're also
                building a dedicated web page where you’ll find all the details — from schedules and
                highlights to how you can participate. Thank you for your enthusiasm and support — we
                can’t wait to share the experience with you. Stay tuned… and get ready to be inspired!
              </p>

              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors rounded-xl"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Events;
