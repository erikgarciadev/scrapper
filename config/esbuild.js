import 'dotenv/config';
import esbuild from 'esbuild';


const entryPoints = [
  'src/sw.js'
];

const { DEPLOYMENT = 'DEV' } = process.env;

esbuild.build({
  entryPoints,
  watch         : DEPLOYMENT==='DEV',
  bundle        : true,
  outdir        : 'dist',
  minify        : !(DEPLOYMENT==='DEV'),
  allowOverwrite: true,
  logLevel      : DEPLOYMENT==='DEV'? 'debug' :'silent',
})
  .then(response => console.log(JSON.stringify(response)))
  .catch(err => console.log(err));