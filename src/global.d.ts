declare module '*.html' { const content: string; export default content; }
declare module '*.json' { const content: any; export default content; }

// image
declare module '*.png' { const content: string; export default content; }
declare module '*.jpg' { const content: string; export default content; }
declare module '*.jpeg' { const content: string; export default content; }
declare module '*.webp' { const content: string; export default content; }

// font
declare module '*.ttf' { const content: string; export default content; }

// audio
declare module '*.mp3' { const content: string; export default content; }

// any text files
declare module '*.fnt' { const content: string; export default content; }
declare module '*.atlas' { const content: string; export default content; }
declare module '*.glsl' { const content: string; export default content; }

// spine binary
declare module '*.skel' { const content: string; export default content; }

// 3d formats
declare module '*.fbx' { const content: string; export default content; }
declare module '*.glb' { const content: string; export default content; }

// CSV
declare module '*.csv' {
    const content: Readonly<Record<string, string>>
    export default content
}
