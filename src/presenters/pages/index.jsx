import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserConsumer} from '../current-user.jsx';
import Link from '../includes/link.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import OverlayVideo from '../overlays/overlay-video.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}


const Dots = () => (
  <div className="dots">
    <div className="dot green"></div>
    <div className="dot yellow"></div>
    <div className="dot red"></div>
  </div>
);

  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const kikiLarge = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-kiki-large.svg?1543431809636";
    const kikiSmall = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-kiki-small.svg?1543431809839";
    const discover = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fexplore-illustration.svg?1543442352754";
    const remix = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543442353173";
    const collaborate = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543442353588";
    
    const play = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchAlt = "Glitch is the friendly community for building the app of your dreams";
    
    return (
      <section className="what-is-glitch">
        <span>
          <figure title="Glitch">
            <img className="kiki large" src={kikiLarge} alt={whatsGlitchAlt}/>
            <img className="kiki small" src={kikiSmall} alt={whatsGlitchAlt}/>
            
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works</span>
              </div>
            </OverlayVideo>
          </figure>
          
          <div className="callouts">
            
            <div className="callout discover">
              <img className="badge" src={discover} alt="discover">
              </img>
              <div className="window">
                <div className="title">
                  Explore 
                  <Dots/>
                </div>
                <div className="description">
                  Discover over a million free apps built by our community
                </div>
              </div>
            </div>
            
            <div className="callout remix">
              <img className="badge" src={remix} alt="remix">
              </img>
              <div className="window">
                <div className="title">
                  Remix
                  <Dots/>
                </div>
                <div className="description">
                  Remix anything you find and edit it to make it your own
                </div>
              </div>
            </div>
            
            <div className="callout collaborate">
              <img className="badge" src={collaborate} alt="collaborate">
              </img>
              <div className="window">
                <div className="title">
                  Collaborate
                  <Dots/>
                </div>
                <div className="description">
                  Invite your whole team to build projects together
                </div>
              </div>
            </div>
            
          </div>
              
        </span>
      </section>
    );
  }
}

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </Link>
  </section>
);

const IndexPage = ({api, user}) => (
  <main>
    {!user.login && <WhatIsGlitch/>}
    
    {!!user.projects.length && <RecentProjects api={api}/>}
    {!!user.login && <Questions api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories/>
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }),
};

const IndexPageContainer = ({api}) => (
  <Layout api={api}>
    <CurrentUserConsumer>
      {user => <IndexPage api={api} user={user}/>}
    </CurrentUserConsumer>
  </Layout>
);

export default IndexPageContainer;
