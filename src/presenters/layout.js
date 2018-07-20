import Layout from '../templates/layout';
import Header from './header.jsx';
import Footer from './footer.jsx';
import NewStuffPresenter from './overlays/new-stuff';
import ProjectModel from '../models/project';
import Observable from 'o_0';

import Reactlet from './reactlet';

export default (application, content) =>

  Layout({

    header() {
      const userObservable = Observable(() => {
        const user = application.currentUser();
        const maybeUser = user.fetched() ? user.asProps() : null;
        if (maybeUser) {
          //Invoke any getters we care about
          maybeUser.teams;
        }
        return maybeUser;
      });
      const props = {
        baseUrl: application.normalizedBaseUrl(),
        userObservable: userObservable,
        searchQuery: application.searchQuery(),
        overlayNewStuffVisible: application.overlayNewStuffVisible,
        promiseProjectsByIds: (projectIds) => ProjectModel.promiseProjectsByIds(application.api(), projectIds),
      };
      return Reactlet(Header, props);
    },
    
    content,

    footer: Reactlet(Footer),
    
    newStuff: NewStuffPresenter(application),
  });
