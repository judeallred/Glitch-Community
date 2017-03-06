HeaderTemplate = require "../templates/includes/header"

module.exports = (application) ->

  self = 
    application: application
  
    template: ->
      HeaderTemplate self

    toggleSignInPopVisible: (event) ->
      application.signInPopVisibleOnHeader.toggle()
      event.stopPropagation()

    showVideoOverlay: ->
      application.overlay.showVideoOverlay()

    hiddenIfUserIsSignedIn: ->
      'hidden' if application.user.isSignedIn()

    hiddenUnlessUserIsSignedIn: ->
      'hidden' unless application.user.isSignedIn()
      
    popHiddenUnlessSignInPopVisible: ->
      'hidden' unless application.signInPopVisibleOnHeader()

    userAvatar: ->
      application.user.avatarImage()

    # userPageLink: ->
    #   userName = application.user.userName()
    # "/@#{userName}"
