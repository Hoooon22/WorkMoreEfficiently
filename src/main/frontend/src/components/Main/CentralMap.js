import React, { Component, createRef } from 'react';
import '../../assets/css/CentralMap.scss';

class CentralMap extends Component {
  constructor(props) {
    super(props);
    
    this.containerRef = createRef();
    this.centralNodeRef = createRef();

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;

    this.nodes = [
      { id: 'central', top: 200, left: 325, label: '본인 이름', color: '#8fb9e3' },
      { id: 'node-1', top: 100, left: 100, label: '결재', color: '#ffe0b3' },
      { id: 'node-2', top: 400, left: 100, label: '일정', color: '#ffd699' },
      { id: 'node-3', top: 100, left: 550, label: '메시지', color: '#ffc266' },
      { id: 'node-4', top: 400, left: 550, label: '파일', color: '#ffb84d' }
    ];
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleMouseDown = (e) => {
    this.isDragging = true;
    this.startX = e.pageX - this.containerRef.current.offsetLeft;
    this.startY = e.pageY - this.containerRef.current.offsetTop;
    this.scrollLeft = this.containerRef.current.scrollLeft;
    this.scrollTop = this.containerRef.current.scrollTop;
  };

  handleMouseMove = (e) => {
    if (!this.isDragging) return;
    e.preventDefault();

    const x = e.pageX - this.containerRef.current.offsetLeft;
    const y = e.pageY - this.containerRef.current.offsetTop;

    const dragSpeedFactor = 0.5;
    const walkX = (x - this.startX) * dragSpeedFactor;
    const walkY = (y - this.startY) * dragSpeedFactor;

    this.containerRef.current.scrollLeft = this.scrollLeft - walkX;
    this.containerRef.current.scrollTop = this.scrollTop - walkY;
  };

  handleMouseUp = () => {
    this.isDragging = false;
  };

  handleMouseLeave = () => {
    this.isDragging = false;
  };

  handleKeyDown = (e) => {
    if (e.key === ' ') { // 스페이스바에 대한 처리
      e.preventDefault(); // 기본 스페이스바 행동 방지 (페이지 스크롤 방지)

      const centralNode = this.centralNodeRef.current;
      const container = this.containerRef.current;

      // 중앙에 맞추기 위해 스크롤을 조정
      const centralNodeRect = centralNode.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const scrollX = centralNodeRect.left + container.scrollLeft - (containerRect.width / 2) + (centralNodeRect.width / 2);
      const scrollY = centralNodeRect.top + container.scrollTop - (containerRect.height / 2) + (centralNodeRect.height / 2);

      // 부드럽게 스크롤 이동
      container.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: 'smooth'
      });
    }
  };

  render() {
    return (
      <div
        className="centralmap-container"
        ref={this.containerRef}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
        style={{ overflow: 'scroll', width: '100%', height: '100vh', position: 'relative' }}
      >
        {this.nodes.map((node) => (
          <div
            key={node.id}
            ref={node.id === 'central' ? this.centralNodeRef : null} // "본인 이름" 노드에만 ref 연결
            className={`node ${node.id}`}
            style={{ top: `${node.top}px`, left: `${node.left}px`, backgroundColor: node.color, position: 'absolute' }}
          >
            {node.label}
          </div>
        ))}
      </div>
    );
  }
}

export default CentralMap;
