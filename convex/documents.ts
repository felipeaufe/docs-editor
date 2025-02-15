import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, { title, initialContent }) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) throw new ConvexError("Unauthorized");

    const organizationId = (user.organization_id ?? undefined) as | string | undefined;

    return await ctx.db.insert("documents", {
      title: title ?? "Untitled document",
      ownerId: user.subject,
      organizationId,
      initialContent: initialContent,
    });
  }
})

export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
  handler: async (ctx, { paginationOpts, search }) => {

    const user = await ctx.auth.getUserIdentity();

    if(!user) throw new ConvexError("Unauthorized");

    const organizationId = (user.organization_id ?? undefined) as | string | undefined;

    // Search within organization
    if (search && organizationId) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", query =>
          query.search("title", search).eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }

    // Personal search
    if (search) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", query => 
          query.search("title", search).eq("ownerId", user.subject))
        .paginate(paginationOpts);
    }

    // Docs inside organization
    if(organizationId) {
      return await ctx.db
        .query("documents")
        .withIndex("by_organization_id", query => query.eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }

    // All personal docs
    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", query => query.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  }
})

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  }
})

export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) throw new ConvexError("Unauthorized");

    const organizationId = (user.organization_id ?? undefined) as | string | undefined;

    const document = await ctx.db.get(id);

    if(!document) throw new ConvexError("Document not found");

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === organizationId);
    // TODO: improve this logic with Roles and permissions by user

    if(!isOwner && !isOrganizationMember) throw new ConvexError("Unauthorized");

    return await ctx.db.delete(id);
  }
})

export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, { id, title }) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(id);

    if(!document) throw new ConvexError("Document not found");

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === user.organization_id);

    if(!isOwner && !isOrganizationMember) throw new ConvexError("Unauthorized");

    return await ctx.db.patch(id, { title });
  }
})