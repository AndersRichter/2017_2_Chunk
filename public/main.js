(function () {
    'use strict';

    //повесить обработчиков!

    const Block = window.Block;
    const Form = window.Form;
    // const Scoreboard = window.Scoreboard;
    // const Profile = window.Profile;
    // const loginFields = window.loginFields;
    const signupFields = window.signupFields;
    const UserService = window.UserService;
    const userService = new UserService();

    const app = new Block(document.getElementById('application'));
    const title = Block.Create('a', {}, ['application-header'], 'Tower Defence');

    const sections = {
        menu: Block.Create('section', {}, ['menu-section', 'section']),
        login: Block.Create('section', {}, ['login-section', 'section']),
        signup: Block.Create('section', {}, ['signup-section', 'section']),
        scores: Block.Create('section', {}, ['scores-section', 'section']),
        profile: Block.Create('section', {}, ['profile-section', 'section']),
        hide() {
            this.menu.hide();
            this.login.hide();
            this.signup.hide();
            this.scores.hide();
            this.profile.hide();
        },
    };

    sections.hide();

    app
        .append(title)
        .append(sections.menu)
        .append(sections.login)
        .append(sections.signup)
        .append(sections.scores)
        .append(sections.profile);

    // function openLogin() {
    //     if (!sections.login.ready) {
    //         sections.login.loginform = new Form(loginFields);
    //         sections.login.loginform.onSubmit(function (formdata) {
    //             userService.login(formdata.email, formdata.password, function (err, resp) {
    //                 if (err) {
    //                     alert(`Some error ${err.status}: ${err.responseText}`);
    //                     return;
    //                 }
    //
    //                 sections.login.loginform.reset();
    //                 userService.getData(function (err, resp) {
    //                     if (err) {
    //                         return;
    //                     }
    //                     openMenu();
    //                 }, true);
    //             });
    //         });
    //         sections.login
    //             .append(Block.Create('h2', {}, [], 'Войдите'))
    //             .append(sections.login.loginform);
    //         sections.login.ready = true;
    //     }
    //     sections.hide();
    //     if (userService.isLoggedIn()) {
    //         return openMenu();
    //     }
    //     sections.login.show();
    // }
    //
    function openSignup() {
        if (!sections.signup.ready) {
            sections.signup.signupform = new Form(signupFields);
            sections.signup.signupform.onSubmit(function (formdata) {
                //нет валидации
                alert('open menu');
                userService.signup(formdata.email, formdata.password, function (err, resp) {
                    if (err) {
                        alert(`Some error ${err.status}: ${err.responseText}`);
                        return;
                    }
                    console.log('Regist!');
                    sections.signup.signupform.reset();
                    openMenu();
                });
            });
            sections.signup
                .append(Block.Create('h2', {}, [], 'Зарегистрируйтесь'))
                .append(sections.signup.signupform);
            sections.signup.ready = true;
        }

        sections.hide();
        if (userService.isLoggedIn()) {
        // if (0) {
            return openMenu();
        }
        sections.signup.show();
    }
    //
    // function openScores() {
    //     if (!sections.scores.ready) {
    //         sections.scores.scoreboard = new Scoreboard();
    //         sections.scores
    //             .append(Block.Create('h2', {}, [], 'Список лидеров'))
    //             .append(sections.scores.scoreboard);
    //         sections.scores.ready = true;
    //     }
    //     sections.hide();
    //     userService.loadUsersList(function (err, users) {
    //         if (err) {
    //             alert(`Some error ${err.status}: ${err.responseText}`);
    //             return openMenu();
    //         }
    //
    //         sections.scores.scoreboard.update(users);
    //         sections.scores.show();
    //     }, true);
    // }
    //
    // function openProfile() {
    //     if (!sections.profile.ready) {
    //         sections.profile.profile = new Profile();
    //         sections.profile
    //             .append(Block.Create('h2', {}, [], 'Мой профиль'))
    //             .append(sections.profile.profile);
    //         sections.profile.ready = true;
    //     }
    //     sections.hide();
    //     if (userService.isLoggedIn()) {
    //         userService.getData(function (err, user) {
    //             if (err) {
    //                 alert(`Some error ${err.status}: ${err.responseText}`);
    //                 return openMenu();
    //             }
    //
    //             sections.profile.profile.update(user);
    //             sections.profile.show();
    //         }, true);
    //         return;
    //     }
    //     return openMenu();
    // }

    function openMenu() {
        if (!sections.menu.ready) {
            sections.menu.items = {
                play: Block.Create('button', {'data-section': 'play'}, ['button'], 'Играть'),
                login: Block.Create('button', {'data-section': 'signup'}, ['button'], 'Зарегистрироваться'),
                signup: Block.Create('button', {'data-section': 'login'}, ['button'], 'Вход'),
                settings: Block.Create('button', {'data-section': 'settings'}, ['button'], 'Настройки'),
                rules: Block.Create('button', {'data-section': 'rules'}, ['button'], 'Правила'),
                scores: Block.Create('button', {'data-section': 'scores'}, ['button'], 'Таблица лидеров'),
            };
            sections.menu.on('click', function (event) {
                event.preventDefault();
                const target = event.target;
                const section = target.getAttribute('data-section');
                switch (section) {
                    case 'login':
                        openLogin();
                        break;
                    case 'signup':
                        openSignup();
                        break;
                    case 'scores':
                        openScores();
                        break;
                    case 'profile':
                        openProfile();
                        break;
                }
            });
            sections.menu
                .append(sections.menu.items.play)
                .append(sections.menu.items.login)
                .append(sections.menu.items.signup)
                .append(sections.menu.items.settings)
                .append(sections.menu.items.rules)
                .append(sections.menu.items.scores);
            sections.menu.ready = true;
        }
        sections.hide();
        // if ()
        if (userService.isLoggedIn()) {
            sections.menu.items.play.show();
            sections.menu.items.login.hide();
            sections.menu.items.signup.hide();
            sections.menu.items.settings.show();
            sections.menu.items.rules.show();
            sections.menu.items.scores.show();
        } else {
            sections.menu.items.play.hide();
            sections.menu.items.login.show();
            sections.menu.items.signup.show();
            sections.menu.items.settings.hide();
            sections.menu.items.rules.show();
            sections.menu.items.scores.show();
        }
        sections.menu.show();
    }

    title.on('click', openMenu);
    openMenu();

    // userService.getData(function (err, resp) {
    //     if (err) {
    //         return;
    //     }
    //     openMenu();
    // }, true);

})();