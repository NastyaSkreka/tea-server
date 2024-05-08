export function generateSlug(text: string): string {

    let slug = text.toLowerCase();

    slug = slug.replace(/[\s\W]+/g, '-');

    slug = slug.replace(/^-+|-+$/g, '');

    return slug;
}