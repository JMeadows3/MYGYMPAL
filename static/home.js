const vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        csrfToken: "",
        blog: [],
        users: [],
        currentUser: {},
        userProfile: {},
        profilePic: null,
        newBlog: {
            "title": "",
            "username": '',
            "body": ""
        },
        postErrors: {},
        profile: '',
    },
    methods: {
        loadBlogs: function() {
            axios({
                method: 'get',
                url: '/api/v1/blog/'
            }).then(response => this.blog = response.data)
        },
        loadUsers: function() {
            axios({
                method: 'get',
                url: '/api/v1/users/'
            }).then(response => this.users = response.data)
        },
        loadCurrentUser: function() {
            axios({
                method: 'get',
                url: '/api/v1/currentuser/'
            }).then(response => this.currentUser = response.data)
        },
        loadProfile: function(blogs) {
            console.log(window.location.pathname)
            this.profile = blogs.user_detail.username

        },
        createPost: function() {
            this.newBlog.username = this.currentUser.username
            axios({
                method: 'post',
                url: '/api/v1/blog/',
                headers: {
                    'X-CSRFToken': this.csrfToken
                },
                data: {
                    "title": this.newBlog.title,
                    "username": this.currentUser.id,
                    "body": this.newBlog.body
                }
            }).then(response => {
                this.loadBlogs()
                this.newBlog = {
                    "title": "",
                    "username": null,
                    "body": ""
                }
                this.postErrors = {}
            }).catch(error => this.postErrors = error.response.data)
        }
    },
    created: function() {
        this.loadBlogs()
        this.loadUsers()
        this.loadCurrentUser()
        this.profile=window.location.pathname.split('/')[3]
        // console.log(window.location.pathname.split('/')[3])


    },
    mounted: function() {
        this.csrfToken = document.querySelector("input[name=csrfmiddlewaretoken]").value
    }
})