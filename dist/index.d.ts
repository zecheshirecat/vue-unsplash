/**
 * Unsplash API plugin for Vue.js
 *
 * @version 3.1.0
 * @author Charlie LEDUC <contact@graphique.io>
 */
export interface UnsplashOptions {
    accessKey?: string;
}
export interface UnsplashLink {
    self?: string;
    html?: string;
    photos?: string;
    likes?: string;
    portfolio?: string;
}
export interface UnsplashUrl {
    raw?: string;
    full?: string;
    regular?: string;
    small?: string;
    thumb?: string;
}
export interface UnsplashUser {
    id?: string;
    updated_at?: string;
    username?: string;
    name?: string;
    portfolio_url?: string;
    bio?: string;
    location?: string;
    total_likes?: number;
    total_photos?: number;
    total_collections?: number;
    instagram_username?: string;
    twitter_username?: string;
    links?: {
        [key: string]: [value: string];
    };
}
export interface UnsplashImage {
    id?: string;
    created_at?: string;
    updated_at?: string;
    width?: number;
    height?: number;
    color?: string;
    blur_hash?: string;
    download?: number;
    likes?: number;
    liked_by_user?: boolean;
    alt?: string;
    description?: string;
    alt_description?: string;
    exif?: {
        [key: string]: any;
    };
    location?: {
        [key: string]: any;
    };
    current_user_collections: any[];
    urls?: {
        [key: string]: [value: string];
    };
    links?: {
        [key: string]: [value: string];
    };
    tags?: {
        title: string;
    }[];
    user?: {
        [key: string]: [value: string];
    };
}
export interface UnsplashCache {
    collections: {
        [key: string]: UnsplashImage[];
    };
    images: UnsplashImage[];
}
export declare enum UnsplashOrderBy {
    Latest = "latest",
    Oldest = "oldest",
    Popular = "popular"
}
export declare enum UnsplashImageOrientation {
    Landscape = "landscape",
    Portrait = "portrait",
    Squarish = "squarish"
}
declare const _default: {
    install: (app: any, options?: UnsplashOptions | undefined) => void;
};
export default _default;
