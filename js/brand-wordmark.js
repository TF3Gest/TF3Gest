(() => {
  const WORD = 'TF3Gest';
  const SKIP = new Set(['SCRIPT','STYLE','TEXTAREA','SELECT','OPTION','NOSCRIPT','CODE','PRE','TITLE']);
  const DARK = '.nw-footer,.nw-contact-hero,.legal-header,.nw-page-hero,.nw-verifactu-section,.nw-security-section,.nw-download-section,.nw-proof-strip,.nw-app-preview__topbar';

  function replaceTextNode(node){
    if (!node || !node.nodeValue || !node.nodeValue.includes(WORD)) return;
    const parent=node.parentElement;
    if (!parent || SKIP.has(parent.tagName)) return;
    if (parent.closest('[data-tf3-text-only],.nw-brand,.nw-page-brand,.legal-brand,.nw-footer__logo')) return;

    const parts=node.nodeValue.split(WORD);
    const frag=document.createDocumentFragment();
    parts.forEach((part,i)=>{
      if(part) frag.appendChild(document.createTextNode(part));
      if(i<parts.length-1){
        const img=document.createElement('img');
        const dark=!!parent.closest(DARK);
        img.className='tf3-wordmark';
        img.src=dark?'images/tf3gest-wordmark-white.png?v=20260828c':'images/tf3gest-wordmark.png?v=20260828c';
        img.alt=WORD;
        img.decoding='async';
        frag.appendChild(img);
      }
    });
    node.replaceWith(frag);
  }

  function process(scope=document.body){
    if(!scope) return;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{acceptNode(node){
      return node.nodeValue && node.nodeValue.includes(WORD) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }

  const start=()=> {
    process();
    const observer=new MutationObserver(mutations=>{
      for(const m of mutations){
        for(const n of m.addedNodes){
          if(n.nodeType===Node.TEXT_NODE) replaceTextNode(n);
          else if(n.nodeType===Node.ELEMENT_NODE && !n.classList?.contains('tf3-wordmark')) process(n);
        }
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();