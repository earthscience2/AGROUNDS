import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DesignSystem_Icons.scss';

// 아이콘
import backIcon from '../../../assets/main_icons/back_black.png';
import downIconBlack from '../../../assets/main_icons/down_black.png';
import upIconBlack from '../../../assets/main_icons/up_black.png';

const DesignSystem_Icons = () => {
  const navigate = useNavigate();
  const [copyText, setCopyText] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [colorIconColors, setColorIconColors] = useState({ color_icons: 'black' });
  const [mainIconColors, setMainIconColors] = useState({ main_icons: 'black' });
  const [viewModes, setViewModes] = useState({
    main_icons: 'simple',
    color_icons: 'simple',
    identify_icon: 'simple',
    nav_icons: 'simple',
    big_icons: 'simple',
    card_icons: 'simple',
    special_icon: 'simple',
    text_icon: 'simple'
  });

  const handleBackClick = () => {
    navigate('/app/admin/design-system');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyText(text);
    setTimeout(() => setCopyText(''), 2000);
  };

  // 동적 이미지 로드
  const getIconSrc = (folderName, fileName) => {
    try {
      const image = require(`../../../assets/${folderName}/${fileName}`);
      return image.default || image;
    } catch (err) {
      console.warn(`Icon not found: ${folderName}/${fileName}`);
      return null;
    }
  };

  const createIconData = () => {
    const iconFolders = {
      big_icons: [
        'ground_left_small.png', 'ground_right_small.png', 'logo_black.png', 'logo_gray.png', 'logo_green.png',
        'position_CAM.png', 'position_CB.png', 'position_CDM.png', 'position_CM.png', 'position_GK.png',
        'position_LB.png', 'position_LM.png', 'position_LWB.png', 'position_LWF.png', 'position_LWM.png',
        'position_RB.png', 'position_RM.png', 'position_RWB.png', 'position_RWF.png', 'position_RWM.png',
        'position_ST.png', 'rader.png'
      ],
      card_icons: [
        'blue_card.png', 'green_card.png', 'red_card.png', 'yellow_card.png'
      ],
      color_icons: [
        'alarm_black.png', 'alarm_gray.png', 'alarm_green.png', 'alarm_red.png', 'alarm_white.png', 'alarm_yellow.png', 'alarm_blue.png',
        'check_activate_black.png', 'check_activate_gray.png', 'check_activate_green.png', 'check_activate_red.png',
        'check_activate_white.png', 'check_activate_yellow.png', 'check_activate_blue.png', 'check_black.png', 'check_deactivate_black.png',
        'check_deactivate_gray.png', 'check_deactivate_green.png', 'check_deactivate_red.png', 'check_deactivate_white.png',
        'check_deactivate_yellow.png', 'check_deactivate_blue.png', 'check_gray.png', 'check_green.png', 'check_red.png', 'check_white.png', 'check_yellow.png', 'check_blue.png',
        'info_black.png', 'info_gray.png', 'info_green.png', 'info_red.png', 'info_white.png', 'info_yellow.png', 'info_blue.png',
        'out_black.png', 'out_gray.png', 'out_green.png', 'out_red.png', 'out_white.png', 'out_yellow.png', 'out_blue.png',
        'place_black.png', 'place_gray.png', 'place_green.png', 'place_red.png', 'place_white.png', 'place_yellow.png', 'place_blue.png',
        'question_black.png', 'question_gray.png', 'question_green.png', 'question_red.png', 'question_white.png', 'question_yellow.png', 'question_blue.png'
      ],
      identify_icon: [
        'add.png', 'apple.png', 'calendar.png', 'delete.png', 'edit.png', 'kakao.png',
        'man.png', 'naver.png', 'no_sign.png', 'star.png', 'woman.png', 'yes_sign.png'
      ],
      main_icons: [
        'back_black.png', 'back_gray.png', 'back_white.png', 'bell_activate_black.png', 'bell_activate_gray.png',
        'bell_activate_white.png', 'bell_balck.png', 'bell_gray.png', 'bell_white.png', 'camera_black.png',
        'camera_gray.png', 'camera_white.png', 'clock_black.png', 'clock_gray.png', 'clock_white.png',
        'close_black.png', 'close_gray.png', 'close_white.png', 'down_black.png', 'down_gray.png', 'down_white.png',
        'download_black.png', 'download_gray.png', 'download_white.png', 'eye_black.png', 'eye_gray.png',
        'eye_off_black.png', 'eye_off_gray.png', 'eye_off_white.png', 'eye_white.png', 'file_black.png',
        'folder_black.png', 'folder_gray.png', 'folder_white.png', 'front_black.png', 'front_gray.png', 'front_white.png',
        'graph_black.png', 'graph_gray.png', 'graph_white.png', 'heart_black.png', 'heart_gray.png', 'heart_white.png',
        'line_black.png', 'line_gray.png', 'line_white.png', 'lock_black.png', 'lock_gray.png', 'lock_white.png',
        'option_black.png', 'option_gray.png', 'option_white.png', 'pencil_black.png', 'pencil_gray.png', 'pencil_white.png',
        'play_black.png', 'play_gray.png', 'play_white.png', 'refresh_black.png', 'refresh_gray.png', 'refresh_white.png',
        'search_black.png', 'search_gray.png', 'search_white.png', 'setting_black.png', 'setting_gray.png', 'setting_white.png',
        'share_black.png', 'share_gray.png', 'share_white.png', 'sort_black.png', 'sort_gray.png', 'sort_white.png',
        'team_black.png', 'team_gray.png', 'team_white.png',
        'unlock_black.png', 'unlock_gray.png', 'unlock_white.png', 'up_black.png', 'up_gray.png', 'up_white.png',
        'user_account_black.png', 'user_account_gray.png', 'user_account_white.png', 'user_black.png', 'user_gray.png', 'user_white.png'
      ],
      nav_icons: [
        'anal_black.png', 'anal_gray.png', 'home_black.png', 'home_gray.png', 'nav_anal_black.png', 'nav_anal_gray.png',
        'nav_home_black.png', 'nav_home_gray.png', 'nav_my_black.png', 'nav_my_gray.png', 'nav_upload_black.png',
        'nav_upload_gray.png', 'nav_video_black.png', 'nav_video_gray.png', 'player_black.png', 'player_gray.png',
        'upload_black.png', 'upload_gray.png', 'video_black.png', 'video_gray.png'
      ],
      special_icon: [
        'ground_left.png', 'ground_right.png'
      ],
      text_icon: [
        'logo_text_black.png', 'logo_text_gray.png', 'logo_text_green.png', 'logo_text_white.png'
      ]
    };

    const getCategoryAndUsage = (fileName, folderName) => {
      const name = fileName.replace('.png', '').toLowerCase();
      
      if (folderName === 'big_icons') {
        if (name.includes('position_')) return { category: 'Position', usage: `${name.replace('position_', '').toUpperCase()} 포지션` };
        if (name.includes('logo_')) return { category: 'Logo', usage: `로고 (${name.replace('logo_', '')})` };
        if (name.includes('ground_')) return { category: 'Ground', usage: '그라운드 아이콘' };
        return { category: 'Big Icons', usage: '대형 아이콘' };
      }
      
      if (folderName === 'card_icons') {
        return { category: 'Card', usage: `${name.replace('_card', '')} 카드` };
      }
      
      if (folderName === 'color_icons') {
        if (name.includes('alarm')) return { category: 'Notification', usage: '알람 아이콘' };
        if (name.includes('check')) return { category: 'Status', usage: '체크 아이콘' };
        if (name.includes('info')) return { category: 'Info', usage: '정보 아이콘' };
        if (name.includes('out')) return { category: 'Action', usage: '나가기 아이콘' };
        if (name.includes('place')) return { category: 'Location', usage: '위치 아이콘' };
        if (name.includes('question')) return { category: 'Help', usage: '질문 아이콘' };
        return { category: 'Color Icons', usage: '컬러 아이콘' };
      }
      
      if (folderName === 'identify_icon') {
        if (name.includes('apple') || name.includes('kakao') || name.includes('naver')) return { category: 'Auth', usage: 'SNS 로그인' };
        if (name.includes('man') || name.includes('woman')) return { category: 'User', usage: '성별 아이콘' };
        if (name.includes('calendar')) return { category: 'Time', usage: '달력' };
        if (name.includes('add')) return { category: 'Action', usage: '추가' };
        if (name.includes('delete')) return { category: 'Action', usage: '삭제' };
        if (name.includes('edit')) return { category: 'Action', usage: '편집' };
        if (name.includes('star')) return { category: 'Rating', usage: '별점/즐겨찾기' };
        if (name.includes('no_sign')) return { category: 'Status', usage: '금지 표시' };
        if (name.includes('yes_sign')) return { category: 'Status', usage: '허용 표시' };
        return { category: 'Identity', usage: '식별 아이콘' };
      }
      
      if (folderName === 'main_icons') {
        if (name.includes('back') || name.includes('front') || name.includes('up') || name.includes('down')) return { category: 'Navigation', usage: '네비게이션' };
        if (name.includes('bell')) return { category: 'Notification', usage: '알림' };
        if (name.includes('camera') || name.includes('play')) return { category: 'Media', usage: '미디어' };
        if (name.includes('graph')) return { category: 'Data', usage: '데이터 시각화' };
        if (name.includes('user') || name.includes('team')) return { category: 'User', usage: '사용자' };
        if (name.includes('lock') || name.includes('unlock')) return { category: 'Security', usage: '보안' };
        if (name.includes('heart') || name.includes('share')) return { category: 'Social', usage: '소셜' };
        if (name.includes('search') || name.includes('setting') || name.includes('option') || name.includes('sort')) return { category: 'Interface', usage: '인터페이스' };
        return { category: 'Main', usage: '메인 아이콘' };
      }
      
      if (folderName === 'nav_icons') {
        return { category: 'Navigation', usage: '네비게이션' };
      }
      
      if (folderName === 'special_icon') {
        return { category: 'Ground', usage: '특별 그라운드' };
      }
      
      return { category: 'Other', usage: '기타' };
    };

    const allIcons = [];
    Object.entries(iconFolders).forEach(([folder, files]) => {
      files.forEach(fileName => {
        const { category, usage } = getCategoryAndUsage(fileName, folder);
        const imageSrc = getIconSrc(folder, fileName);
        
        allIcons.push({
          name: fileName.replace('.png', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `${folder}/${fileName}`,
          folder,
          category,
          usage,
          src: imageSrc
        });
      });
    });

    return allIcons;
  };
  
  const allIcons = createIconData();

  const toggleFolder = (folderName) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const toggleViewMode = (folderName, mode) => {
    setViewModes(prev => ({
      ...prev,
      [folderName]: mode
    }));
  };

  const folderInfo = {
    'big_icons': {
      title: 'BIG ICONS',
      description: '로고, 포지션, 레이더 차트 등 대형 아이콘',
      purpose: '메인 브랜딩 및 포지션 표시용'
    },
    'card_icons': {
      title: 'CARD ICONS',
      description: '축구 경기에서 사용되는 카드 아이콘',
      purpose: '블루/그린/레드/옐로우 카드 표시용'
    },
    'color_icons': {
      title: 'COLOR ICONS', 
      description: '7가지 색상으로 구성된 상태 표시 아이콘',
      purpose: '다양한 상태와 액션을 컬러로 구분하여 표시'
    },
    'identify_icon': {
      title: 'IDENTIFY ICONS',
      description: 'SNS 로그인, 성별, 액션 등 식별용 아이콘', 
      purpose: '사용자 식별 및 기본 액션용'
    },
    'main_icons': {
      title: 'MAIN ICONS',
      description: '주요 UI에서 사용되는 3색상 아이콘 시스템',
      purpose: 'Black/Gray/White 3색상으로 다양한 테마 대응'
    },
    'nav_icons': {
      title: 'NAV ICONS', 
      description: '내비게이션 바 전용 아이콘',
      purpose: '하단 네비게이션 및 메뉴 표시용'
    },
    'special_icon': {
      title: 'SPECIAL ICONS',
      description: '특수한 그라운드 표시 아이콘',
      purpose: '그라운드 방향 및 특수 상황 표시용'
    },
    'text_icon': {
      title: 'TEXT ICONS',
      description: 'AGROUNDS 텍스트 로고 아이콘',
      purpose: '페이지 하단 브랜딩 및 텍스트 로고 표시용'
    }
  };

  return (
    <div className="design-system-icons">
      <header className="design-header">
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackClick}>
            <img src={backIcon} alt="뒤로가기" />
          </button>
        </div>
        <div className="header-content">
          <h1 className="text-h1">아이콘 시스템</h1>
          <p className="text-body">총 {allIcons.length}개의 아이콘을 8개 폴더에 체계적으로 정리</p>
        </div>
      </header>

      <div className="design-container">
        <div className="design-content">
          <div className="design-section">
            {/* 폴더별 개요 */}
            <div className="folder-overview">
              <h3>폴더별 아이콘 현황</h3>
              <div className="folder-stats-grid">
                {['main_icons', 'color_icons', 'identify_icon', 'nav_icons', 'big_icons', 'card_icons', 'special_icon', 'text_icon'].map((folderName) => {
                  const info = folderInfo[folderName];
                  const folderIcons = allIcons.filter(icon => icon.folder === folderName);
                  return (
                    <div key={folderName} className="folder-stat-card">
                      <div className="folder-header">
                        <div className="folder-meta">
                          <h4>{info.title}</h4>
                          <span className="folder-count">{folderIcons.length}개</span>
                        </div>
                      </div>
                      <p className="folder-description">{info.description}</p>
                      <span className="folder-purpose">{info.purpose}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 폴더별 아이콘 상세 */}
            {['main_icons', 'color_icons', 'identify_icon', 'nav_icons', 'big_icons', 'card_icons', 'special_icon', 'text_icon'].map((folderName) => {
              const info = folderInfo[folderName];
              const folderIcons = allIcons.filter(icon => icon.folder === folderName);
              const isCollapsed = collapsedFolders[folderName];
              
              return (
                <div key={folderName} className="icon-folder-section">
                  <div className="folder-header-detail">
                    <div className="folder-title-main">
                      <span className="folder-name">{info.title}</span>
                      <span className="folder-badge">{folderIcons.length}개</span>
                      
                      {!isCollapsed && (
                        <div className="view-mode-buttons">
                          <button 
                            className={`view-mode-btn ${viewModes[folderName] === 'simple' ? 'active' : ''}`}
                            onClick={() => toggleViewMode(folderName, 'simple')}
                          >
                            간단
                          </button>
                          <button 
                            className={`view-mode-btn ${viewModes[folderName] === 'detailed' ? 'active' : ''}`}
                            onClick={() => toggleViewMode(folderName, 'detailed')}
                          >
                            자세히
                          </button>
                        </div>
                      )}
                      
                      <button 
                        className="folder-toggle-btn"
                        onClick={() => toggleFolder(folderName)}
                      >
                        <img 
                          src={isCollapsed ? downIconBlack : upIconBlack} 
                          alt={isCollapsed ? '펼치기' : '접기'}
                        />
                      </button>
                    </div>
                    <div className="folder-description-detail">
                      <p>{info.description}</p>
                      <span className="folder-path">/src/assets/{folderName}/</span>
                    </div>
                    
                    {/* 색상 변경 컨트롤 */}
                    {(folderName === 'color_icons' || folderName === 'main_icons') && !isCollapsed && (
                      <div className="color-controls">
                        <span className="color-label">색상 선택:</span>
                        <div className="color-buttons">
                          {folderName === 'color_icons' ? (
                            [
                              { name: 'black', displayName: 'Black', bgColor: '#000000' },
                              { name: 'gray', displayName: 'Gray', bgColor: '#6B7078' },
                              { name: 'green', displayName: 'Green', bgColor: '#079669' },
                              { name: 'red', displayName: 'Red', bgColor: '#ef4444' },
                              { name: 'white', displayName: 'White', bgColor: '#FFFFFF' },
                              { name: 'yellow', displayName: 'Yellow', bgColor: '#f59e0b' },
                              { name: 'blue', displayName: 'Blue', bgColor: '#3b82f6' }
                            ].map(({ name, displayName, bgColor }) => (
                              <button
                                key={name}
                                className={`color-swatch-btn ${colorIconColors[folderName] === name ? 'active' : ''}`}
                                onClick={() => setColorIconColors(prev => ({ ...prev, [folderName]: name }))}
                                style={{ 
                                  backgroundColor: bgColor,
                                  border: name === 'white' ? '2px solid var(--border)' : '2px solid transparent'
                                }}
                              >
                                <span className="color-name">{displayName}</span>
                              </button>
                            ))
                          ) : (
                            [
                              { name: 'black', displayName: 'Black', bgColor: '#000000' },
                              { name: 'gray', displayName: 'Gray', bgColor: '#6B7078' },
                              { name: 'white', displayName: 'White', bgColor: '#FFFFFF' }
                            ].map(({ name, displayName, bgColor }) => (
                              <button
                                key={name}
                                className={`color-swatch-btn ${mainIconColors[folderName] === name ? 'active' : ''}`}
                                onClick={() => setMainIconColors(prev => ({ ...prev, [folderName]: name }))}
                                style={{ 
                                  backgroundColor: bgColor,
                                  border: name === 'white' ? '2px solid var(--border)' : '2px solid transparent'
                                }}
                              >
                                <span className="color-name">{displayName}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className={`icons-grid ${(folderName === 'big_icons' || folderName === 'special_icon') ? 'large-icons-grid' : ''} ${viewModes[folderName] === 'simple' ? 'simple-mode' : ''}`}>
                      {(() => {
                        let filteredIcons = folderIcons;
                        
                        // COLOR ICONS: 선택된 색상에 해당하는 아이콘만 필터링
                        if (folderName === 'color_icons' && colorIconColors[folderName]) {
                          const selectedColor = colorIconColors[folderName];
                          filteredIcons = folderIcons.filter(icon => {
                            const fileName = icon.path.split('/')[1];
                            return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                          });
                        }
                        
                        // MAIN ICONS: 선택된 색상에 해당하는 아이콘만 필터링
                        if (folderName === 'main_icons' && mainIconColors[folderName]) {
                          const selectedColor = mainIconColors[folderName];
                          filteredIcons = folderIcons.filter(icon => {
                            const fileName = icon.path.split('/')[1];
                            return fileName.toLowerCase().includes(`_${selectedColor}.png`);
                          });
                        }
                        
                        return filteredIcons.map((icon, index) => {
                          const fileName = icon.path.split('/')[1];
                          const selectedColor = (folderName === 'color_icons' ? colorIconColors[folderName] : 
                                               folderName === 'main_icons' ? mainIconColors[folderName] : null);
                          const isWhiteIcon = selectedColor === 'white';
                          const isSimpleMode = viewModes[folderName] === 'simple';

                          return (
                            <div key={index} className={`icon-item ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-item-large' : ''} ${isSimpleMode ? 'icon-item-simple' : ''}`}>
                              <div className={`icon-display ${isWhiteIcon ? 'white-icon-bg' : ''} ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-display-large' : ''}`}>
                                <div className="icon-image-container">
                                  {icon.src ? (
                                    <img 
                                      src={icon.src}
                                      alt={icon.name}
                                      className={`icon-image-large ${(folderName === 'big_icons' || folderName === 'special_icon' || folderName === 'text_icon') ? 'icon-image-xl' : ''}`}
                                      loading="lazy"
                                      title={isSimpleMode ? icon.name : ''}
                                    />
                                  ) : (
                                    <div className="icon-placeholder" title={icon.name}>
                                      <span className="icon-name-short">{icon.name.charAt(0)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {!isSimpleMode && (
                                <div className="icon-info">
                                  <h4>{icon.name}</h4>
                                  <div className="icon-details">
                                    <span className="icon-category-tag">{icon.category}</span>
                                    <span className="icon-path-code">{fileName}</span>
                                  </div>
                                  <p className="icon-usage">{icon.usage}</p>
                                  <button 
                                    className="copy-path-btn"
                                    onClick={() => copyToClipboard(`import ${icon.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')} from '../../../assets/${icon.path}';`)}
                                  >
                                    Import 복사
                                  </button>
                                </div>
                              )}
                              
                              {isSimpleMode && (
                                <div className="icon-simple-name">
                                  {icon.name}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem_Icons;

