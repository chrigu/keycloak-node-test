export const authQueries = {
    // login: (root, args, ctx, info) => console.log(args, ctx, info, root)
    me: (root, args, ctx, info) => {
      // console.log(args, ctx, info, root);
      console.log(info);
      return "hello"
    }
  }