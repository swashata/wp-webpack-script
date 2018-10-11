// This is used to initialize a project
/*
// If wpackio.project.js is present, then don't init the project stuff.
// If wpackio.server.js is present, then don't init the server stuff.
// If both are present, then bail

//// For wpackio.project.js
1. Ask appName (auto-generate from package.json)
2. Ask type (if style.css present, then theme)
3. Ask slug (default, directory name)
4. Generate Author Name, version, link, license, etc (for banner) from package.json
5. Ask outputPath (relative), defaults 'dist'
6. Ask if react, sass, flow needed.
7. If sass needed, then install node-sass.
8. Ask glob pattern for .php files.

//// For wpackio.server.js
1. Ask proxy URL.
*/
