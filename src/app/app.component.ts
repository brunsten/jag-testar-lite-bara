import { Component, ElementRef, VERSION, ViewChild } from '@angular/core';
import { SVG, Svg } from '@svgdotjs/svg.js';
import { Draggable } from 'gsap/Draggable';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  svgWidth = 0;
  svgHeight = 0;
  icon: TemplateItem;
  primary: TemplateItem;
  secondary: TemplateItem;

  lines: {
    top: LineCoords;
    bottom: LineCoords;
    left: LineCoords;
    right: LineCoords;
  };
  @ViewChild('svgElement', { read: ElementRef, static: true }) svgElement;
  @ViewChild('backgroundElement', { read: ElementRef, static: true })
  backgroundElement;
  @ViewChild('iconElement', { read: ElementRef, static: true }) iconElement;
  @ViewChild('primaryTextElement', { read: ElementRef, static: true })
  primaryTextElement;
  @ViewChild('secondaryTextElement', { read: ElementRef, static: true })
  secondaryTextElement;
  ngOnInit() {
    this.svgWidth = templateData.size.width;
    this.svgHeight = templateData.size.height;
    this.icon = templateData.items.find((item) => item.id === 'icon') as any;
    this.primary = templateData.items.find(
      (item) => item.id === 'primary-text'
    ) as any;
    this.secondary = templateData.items.find(
      (item) => item.id === 'secondary-text'
    ) as any;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const svg = SVG(this.svgElement.nativeElement) as Svg;
      const primaryBoundings = this.getSomething(
        this.primaryTextElement.nativeElement,
        this.svgElement.nativeElement
      );
      this.lines = {
        top: {
          x1: primaryBoundings.topLeft.x,
          x2: primaryBoundings.topRight.x,
          y1: primaryBoundings.topLeft.y,
          y2: primaryBoundings.topRight.y,
        },
        bottom: {
          x1: primaryBoundings.bottomLeft.x,
          x2: primaryBoundings.bottomRight.x,
          y1: primaryBoundings.bottomLeft.y,
          y2: primaryBoundings.bottomRight.y,
        },
        right: {
          x1: primaryBoundings.topRight.x,
          x2: primaryBoundings.bottomRight.x,
          y1: primaryBoundings.topRight.y,
          y2: primaryBoundings.bottomRight.y,
        },
        left: {
          x1: primaryBoundings.topLeft.x,
          x2: primaryBoundings.bottomLeft.x,
          y1: primaryBoundings.topLeft.y,
          y2: primaryBoundings.bottomLeft.y,
        },
      };
      const iconPoints = this.getSomething(
        this.iconElement.nativeElement,
        this.svgElement.nativeElement
      );
      for (let key in iconPoints) {
        const circle = svg.circle(20);
        circle.attr({ x: iconPoints[key].x, y: iconPoints[key].y });
      }

      Draggable.create(this.iconElement.nativeElement, {
        liveSnap: {
          points: [
            { x: iconPoints.bottomLeft.x, y: iconPoints.bottomLeft.y },
            { x: iconPoints.topRight.x, y: iconPoints.topRight.y },
          ],
          radius: 50,
        },

        bounds: document.getElementById('container'),
        inertia: true,
        onClick: function () {
          console.log('clicked');
        },
        onDragEnd: function () {
          console.log('drag ended');
        },
      });
    }, 500);
  }
  getSomething(element: SVGElement, svg: SVGSVGElement) {
    let r: DOMRect;
    try {
      r = (element as SVGSVGElement).getBBox();
      if (!r.x && !r.y && !r.width && !r.height) {
        throw new Error('getBbox Failed');
      }
    } catch {
      // FF Cannot use getBBox on clips
      const clone = element.cloneNode(true) as SVGSVGElement;
      svg.appendChild(clone);
      r = clone.getBBox();
      clone.remove();
    }
    const p = svg.createSVGPoint();

    const matrix = svg
      .getScreenCTM()
      .inverse()
      .multiply((element as unknown as SVGRectElement).getScreenCTM());
    p.x = r.x;
    p.y = r.y;
    const a = p.matrixTransform(matrix);

    p.x = r.x + r.width;
    p.y = r.y;
    const b = p.matrixTransform(matrix);

    p.x = r.x + r.width;
    p.y = r.y + r.height;
    const c = p.matrixTransform(matrix);

    p.x = r.x;
    p.y = r.y + r.height;
    const d = p.matrixTransform(matrix);
    return { topLeft: a, topRight: b, bottomRight: c, bottomLeft: d };
  }
}

const templateData = {
  size: { width: 550, height: 550 },
  items: [
    {
      position: { x: 0, y: 0 },
      elementPosition: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      id: 'background',
      content: {
        isDefault: false,
        color: '#414141',
        backgroundId: null,
        gradient: null,
      },
    },
    {
      position: { x: 14.692307692307697, y: 151.47533539016194 },
      elementPosition: { x: 14.692307692307697, y: 151.47533539016194 },
      size: { width: 100.83516483516485, height: 132.00818109335458 },
      id: 'icon',
      content: { iconId: 4070 },
    },
    {
      position: { x: 136.48398900294046, y: 222.1595253050841 },
      elementPosition: { x: 136.48398900294046, y: 186.69398354812904 },
      size: { width: 375.6752672539135, height: 48.05628964357054 },
      id: 'primary-text',
      content: {
        value: 'Username',
        fontId: 542,
        fontSize: 48.05628964357054,
        colors: { original: '#414141', alternative: '#ffffff' },
        align: 'left',
        nonScaledLetterSpacing: 3,
        letterSpacing: 2.4650647594112716,
        transformation: 'normal',
      },
    },
    {
      position: { x: 139.54370351938098, y: 249.30721526802282 },
      elementPosition: { x: 139.54370351938098, y: 239.87019774113952 },
      size: { width: 140.8780683717277, height: 12.599489354984385 },
      id: 'secondary-text',
      content: {
        value: 'Company Tagline',
        fontId: 331,
        fontSize: 12.599489354984385,
        colors: { original: '#d8982f', alternative: '#d8982f' },
        align: 'left',
        nonScaledLetterSpacing: 2,
        letterSpacing: 1.6520566491020827,
        transformation: 'normal',
      },
    },
  ],
  isDefaultPositionsRecalculated: true,
  centerObjects: { vertical: 'primary-text', horizontal: '' },
  version: 1,
  guidelines: [],
};

interface TemplateItem {
  position: { x: number; y: number };
  elementPosition: { x: number; y: number };
  size: { width: number; height: number };
  id: 'primary-text' | 'icon' | 'secondary-text';
  content: any;
}

interface LineCoords {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
