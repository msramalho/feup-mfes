/**
 * Created by josep on 07/02/2016.
 */

/*Default page behaviours*/
Router.configure({
    //Template displayed while loading data.
    loadingTemplate: 'loading',
    //Template displayed when there's no route for the sub domain.
    notFoundTemplate: 'notFound',
    //Main page template, useful to display copyrights and menus in every page.
    layoutTemplate: 'layout'
});

/*Home page routing - single page*/
Router.route('/', {
    name: 'editor',
    template: 'alloyEditor',
    where: 'client'
});
Router.route('/:_id', {
    name: 'editorLoad',
    template: 'alloyEditor',
    controller: "editorLoadController",
    where: 'client'
});