import type {DigitalAsset} from '../lib/digital-assets';

export default function AssetPreview({asset}: {asset: DigitalAsset}) {
  return <div className={'asset-preview asset-preview-' + asset.preview} aria-hidden="true">
    {asset.preview === 'website' ? <div className="preview-browser"><div className="preview-toolbar"><i/><i/><i/><span>studio / creative practice</span></div><div className="preview-web-body"><div><span>SMALL STUDIO. BIG IDEAS.</span><strong>Make room<br/>for <em>something good.</em></strong><b>Let’s build together ↗</b></div><div className="preview-sculpture"><span/><span/><span/></div></div><div className="preview-web-footer"><span>Strategy</span><span>Design</span><span>Development</span></div></div>
      : asset.preview === 'planner' ? <div className="preview-sheet"><span>YOUR NEXT GOOD IDEA</span><strong>{asset.access === 'Free' ? 'A week, well planned.' : 'Plan. Launch. Learn.'}</strong><div className="preview-sheet-table"><div><b>DAY</b><b>CONTENT</b><b>STATUS</b></div>{['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, i) => <div key={day}><span>{day}</span><span>{['Tell your story', 'Share a useful tip', 'Show the process', 'Start a conversation'][i]}</span><i>{i < 2 ? 'Ready' : 'Draft'}</i></div>)}</div></div>
      : <div className="preview-social"><span>YOUR BRAND / NOTES & IDEAS</span><strong>Good things.<br/><em>Coming your way.</em></strong><div className="preview-social-bottom"><span>A new chapter starts here.</span><b>↗</b></div><i/></div>}
  </div>;
}
