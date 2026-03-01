const fs = require('fs');
const path = require('path');

const filePath = path.join('f:', 'UNIVERSITY_PROJECT', 'Advyon-Legal Plateform', 'advyon-client', 'src', 'pages', 'dashboard', 'AdminPanelPage.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// Fix TabsList
content = content.replace(
  /<TabsList className="grid w-full grid-cols-5 max-w-lg">/g,
  '<TabsList className="flex w-full overflow-x-auto custom-scrollbar md:grid md:grid-cols-5 max-w-full md:max-w-lg justify-start h-auto p-1">'
);

// Fix TabsTrigger classes
content = content.replace(
  /<TabsTrigger value="users" className="flex items-center gap-1\.5 text-xs">/g,
  '<TabsTrigger value="users" className="flex shrink-0 items-center gap-1.5 text-xs px-4 py-2 md:px-2">'
);
content = content.replace(
  /<TabsTrigger value="cases" className="flex items-center gap-1\.5 text-xs">/g,
  '<TabsTrigger value="cases" className="flex shrink-0 items-center gap-1.5 text-xs px-4 py-2 md:px-2">'
);
content = content.replace(
  /<TabsTrigger value="settings" className="flex items-center gap-1\.5 text-xs">/g,
  '<TabsTrigger value="settings" className="flex shrink-0 items-center gap-1.5 text-xs px-4 py-2 md:px-2">'
);
content = content.replace(
  /<TabsTrigger value="analytics" className="flex items-center gap-1\.5 text-xs">/g,
  '<TabsTrigger value="analytics" className="flex shrink-0 items-center gap-1.5 text-xs px-4 py-2 md:px-2">'
);
content = content.replace(
  /<TabsTrigger value="audit" className="flex items-center gap-1\.5 text-xs">/g,
  '<TabsTrigger value="audit" className="flex shrink-0 items-center gap-1.5 text-xs px-4 py-2 md:px-2">'
);

// Fix Recent Cases table overflow
content = content.replace(
  /<div className="border rounded-lg overflow-hidden">\s*<table className="w-full text-sm">/g,
  '<div className="border rounded-lg overflow-x-auto">\n          <table className="w-full text-sm min-w-[600px]">'
);

// Fix Users table (it already has overflow-x-auto, but might need min-w)
content = content.replace(
  /<div className="border rounded-lg overflow-x-auto">\s*<table className="w-full text-sm">/g,
  '<div className="border rounded-lg overflow-x-auto">\n          <table className="w-full text-sm min-w-[800px]">'
);

// Fix Audit Logs table
content = content.replace(
  /<div className="border rounded-lg overflow-x-auto">\s*<table className="w-full text-sm">/g,
  '<div className="border rounded-lg overflow-x-auto">\n          <table className="w-full text-sm min-w-[600px]">'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed AdminPanelPage.jsx layouts!');
