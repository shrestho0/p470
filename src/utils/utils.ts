export function sanitizedGotoUrl(url: string | undefined): string {

    if (!url) {
        return '/dashboard'
    }

    // check for external links
    if (url.startsWith('http')) {
        url = url.replace('http://', '');
        url = url.replace('https://', '');
    }

    // check for circular redirection
    if (url.startsWith('/signin')) {
        url = '/dashboard'
    }

    return url

}

