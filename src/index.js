import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const users = [
    { id: "1", name: "ahmed", email: "ahmed@gmail.com", age: 21 },
    { id: "2", name: "issam", email: "issam@gmail.com", age: 28 },
    { id: "3", name: "mouad", email: "mouad@gmail.com" }
]
const posts = [
    {
        id: "P1",
        title: "blog1",
        body: "blog1 s body",
        published: true,
        author: "1"
    }, {
        id: "P2",
        title: "blog2",
        body: "blog2 s body",
        published: false,
        author: "2"
    }, {
        id: "P3",
        title: "blog3",
        body: "blog3 s body",
        published: true,
        author: "3"
    }
]

const comments = [
    {
        id: "C1",
        text: "first comment",
        author: "1",
        post: "P1"
    }, {
        id: "C2",
        text: "second comment",
        author: "2",
        post: "P3"
    }, {
        id: "C3",
        text: "third comment",
        author: "3",
        post: "P2"
    }, {
        id: "C4", text: "fourth comment", author: "1", post: "P1"
    }]
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
        me: User!
        post: Post! 
    }
    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments : [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!   
        comments: [Comment!]!
    }
    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        posts(parent, args) {
            if (args.query === undefined) {
                return posts
            }
            return posts.filter(post => {
                const matchTitle = post.title.toLowerCase().includes(args.query.toLowerCase())
                const matchBody = post.body.toLowerCase().includes(args.query.toLowerCase())
                return matchBody || matchTitle
            })
        },
        users(parent, args) {
            if (args.query === undefined) {
                return users
            }
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))

        },
        comments() {
            return comments
        },

        me() {
            return {
                id: "125467",
                name: "ayoub",
                email: "ayoub@ayoub.com",
                age: null
            }
        },

        post() {
            return {
                id: "1245783",
                title: "blogger",
                body: "our blog",
                published: true
            }
        }
    },
    Post: {
        author(parent, args, cxt, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, cxt, info) {
            return comments.filter(comment => comment.post === parent.id)
        }

    },
    Comment: {
        author(parent, args, cxt, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, cxt, info) {
            return posts.find(post => post.id === parent.post)
        }
    },
    User: {
        posts(parent, args, cxt, info) {
            return posts.filter(post => {
                return post.author === parent.id
            })
        },
        comments(parent, args, cxt, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})