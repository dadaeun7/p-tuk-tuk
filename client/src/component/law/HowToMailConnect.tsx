import { useNavigate } from "react-router-dom";
import "../../css/how-to-connect.css";

function HowToMailConnect() {

    const nav = useNavigate();
    return (
        <div className="how-to-connect-box">
            <div className="container">
                <div
                    style={{
                        cursor: "pointer",
                        width: "12rem",
                        borderBottom: "solid 1px #A8D8B9",
                        color: "#38b463ff"
                    }}
                    onClick={() => {
                        nav(-1);
                    }}

                > 👈이전 페이지로 돌아가기</div>
                <h1>Gmail로 Daum & Naver 메일·주소록 가져오기 💌</h1>
                <p>기존에 사용하던 Daum(다음)과 Naver(네이버)의 메일과 주소록을 Gmail로 간편하게 옮기는 방법을 소개합니다. <br />이제 여러 이메일 계정을 확인할 필요 없이, Gmail 한 곳에서 모든 것을 관리해 보세요!</p>
                <hr />

                <h2>1. Daum (다음/카카오) 가져오기</h2>
                <h3>1단계: Daum (다음/카카오) 메일 POP3 설정 켜기</h3>

                <ol>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>다음 설정 진입</span></strong><br />
                        다음 메인화면에서 <strong>'메일'</strong>로 이동 해주세요.<br />
                        <img src="/kakao_1.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>인증센터에서 2단계 인증 진입</span></strong><br />
                        'POP3/SMTP 설정' 항목을 <strong>'POP3'</strong>항목으로 진입하여 POP3/SMTP을 <strong>사용함</strong>체크한 후
                        오른쪽 하단의<br /> <strong>2단계 인증 설정하기</strong>로 이동해주세요.
                        <p style={{ fontSize: '0.9rem' }}>사용자님의 🙇‍♀️안전한 사용 및 원활한 연동을 위해 2단계 인증을 설정해주세요</p>
                        <img src="/kakao_2.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>보안 설정에 본인 인증</span></strong><br />
                        진입 된 화면에서 다음 계정 비밀번호로 인증해주세요.<br />
                        <img src="/kakao_3.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>1. 애플리케이션 비밀번호 발급</span></strong><br />
                        2단계 인증 <strong>사용중</strong> 으로 활성화 해주신 후 앱 비밀번호로 진입합니다.<br />
                        <img src="/kakao_4.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>2. 애플리케이션 비밀번호 발급</span></strong><br />
                        앱 이름은 원하는 명칭으로 입력 후 생성해주세요.<br />
                        <img src="/kakao_5.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>3. 애플리케이션 비밀번호 발급</span></strong><br />
                        발급된 앱 비밀번호를 복사합니다.<br />
                        <img src="/kakao_6.svg" alt="다음 POP3/IMAP 설정" />
                    </li>
                </ol>
                <h3>2단계: Gmail에 Daum (다음/카카오) 계정 추가하기</h3>
                <ol>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>Gmail 설정 열기</span></strong><br />
                        PC에서 Gmail에 로그인 후, 우측 상단 <strong>설정 아이콘(⚙️) 👉 '모든 설정 보기'</strong>를 클릭하세요.<br />
                        <img src="/gmail_1.svg" alt="Gmail 설정 메뉴" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>계정 및 가져오기 탭 이동</span></strong><br />
                        <strong>'계정 및 가져오기'</strong> 탭을 선택한 뒤, <strong>'다른 계정에서 메일 확인하기'</strong>에서 메일 계정 추가를 클릭합니다.<br />
                        <img src="/gmail_2.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>1. 메일 계정 추가</span></strong><br />
                        다음 이메일 주소를 입력하고 다음을 눌러줍니다.<br />
                        <img src="/gmail_3.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>2. 메일 계정 추가</span></strong><br />
                        <strong>다른 계정에서 이메일 가져오기(POP3)</strong>체크 후 다음을 눌러줍니다.<br />
                        <img src="/gmail_4.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>팝업창 안내에 따라 네이버 메일 주소와 아래 정보를 정확히 입력하세요.</span></strong>
                        <ul style={{ marginTop: '0.8rem' }}>
                            <li style={{ marginLeft: '-2rem' }}><strong>사용자 이름:</strong> <code>자동 매칭됩니다.</code></li>
                            <li style={{ marginLeft: '-2rem' }}><strong>비밀번호:</strong> 1번에서 발급한 애플리케이션 비밀번호</li>
                            <li style={{ marginLeft: '-2rem' }}><strong>POP 서버:</strong> <code>pop.daum.net</code></li>
                            <li style={{ marginLeft: '-2rem' }}><strong>포트:</strong> <code>995</code></li>
                            <li style={{ marginLeft: '-3rem' }}>✅ <strong>'보안 연결(SSL)'</strong> 옵션을 <strong>반드시 체크</strong>하세요.</li>
                        </ul>
                        <img src="/gmail_5_kakao.svg" alt="다음 메일 서버 정보 입력" />
                    </li>
                    <li>등록까지 1~3분 정도 시간이 소요됩니다. </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>메일 계정 추가 완료</span></strong><br />
                        해당 항목중 원하는 항목에 체크하고 완료를 눌러줍니다.<br />
                        <img src="/gmail_6.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                </ol>

                <hr />

                <h2>2. Naver (네이버) 가져오기</h2>

                <h3>1단계: 네이버 메일 POP3 설정 켜기</h3>
                <ol>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>네이버 설정 진입</span></strong><br />
                        네이버 메인에서 <strong>'자물쇠 모양'</strong>클릭해주세요.<br />
                        <img src="/naver_1.svg" alt="네이버 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>인증센터에서 2단계 인증 진입</span></strong><br />
                        왼쪽의 2단계 인증의 <strong>'관리'</strong>를 선택하세요.<br />
                        <p style={{ fontSize: '0.9rem' }}>[선택] 사용자님의 🙇‍♀️안전한 사용을 위해 2단계 인증을 설정해주세요</p>
                        <img src="/naver_2.svg" alt="네이버 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>보안 설정에 본인 인증</span></strong><br />
                        상단 내프로필 | 보안설정 | 이력관리 에서 <strong>'보안설정'</strong>선택 후 네이버 계정 비밀번호로 인증해주세요.<br />
                        <img src="/naver_3.svg" alt="네이버 POP3/IMAP 설정" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>애플리케이션 비밀번호 발급</span></strong><br />
                        애플리케이션 비밀번호 관리에서 종류에 <strong>'지메일'</strong>선택 후 생성하기 버튼을 통해 애플리케이션 비밀번호를 생성해주세요.<br />
                        <img src="/naver_4.svg" alt="네이버 POP3/IMAP 설정" />
                    </li>
                </ol>

                <h3>2단계: Gmail에 네이버 계정 추가하기</h3>
                <ol>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>Gmail 설정 열기</span></strong><br />
                        PC에서 Gmail에 로그인 후, 우측 상단 <strong>설정 아이콘(⚙️) 👉 '모든 설정 보기'</strong>를 클릭하세요.<br />
                        <img src="/gmail_1.svg" alt="Gmail 설정 메뉴" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>계정 및 가져오기 탭 이동</span></strong><br />
                        <strong>'계정 및 가져오기'</strong> 탭을 선택한 뒤, <strong>'다른 계정에서 메일 확인하기'</strong>에서 메일 계정 추가를 클릭합니다.<br />
                        <img src="/gmail_2.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>1. 메일 계정 추가</span></strong><br />
                        다음 이메일 주소를 입력하고 다음을 눌러줍니다.<br />
                        <img src="/gmail_3.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>2. 메일 계정 추가</span></strong><br />
                        <strong>다른 계정에서 이메일 가져오기(POP3)</strong>체크 후 다음을 눌러줍니다.<br />
                        <img src="/gmail_4.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>팝업창 안내에 따라 네이버 메일 주소와 아래 정보를 정확히 입력하세요.</span></strong>
                        <ul style={{ marginTop: '0.8rem' }}>
                            <li style={{ marginLeft: '-2rem' }}><strong>사용자 이름:</strong> <code>자동 매칭됩니다.</code></li>
                            <li style={{ marginLeft: '-2rem' }}><strong>비밀번호:</strong> 1번에서 발급한 네이버 애플리케이션 비밀번호</li>
                            <li style={{ marginLeft: '-2rem' }}><strong>POP 서버:</strong> <code>pop.naver.com</code></li>
                            <li style={{ marginLeft: '-2rem' }}><strong>포트:</strong> <code>995</code></li>
                            <li style={{ marginLeft: '-3rem' }}>✅ <strong>'보안 연결(SSL)'</strong> 옵션을 <strong>반드시 체크</strong>하세요.</li>
                        </ul>
                        <img src="/gmail_5_naver.svg" alt="네이버 메일 서버 정보 입력" />
                    </li>
                    <li>등록까지 1~3분 정도 시간이 소요됩니다. </li>
                    <li>
                        <strong><span style={{ fontSize: "1.3rem" }}>메일 계정 추가 완료</span></strong><br />
                        해당 항목중 원하는 항목에 체크하고 완료를 눌러줍니다.<br />
                        <img src="/gmail_6.svg" alt="Gmail 계정 및 가져오기" />
                    </li>
                </ol>

                <div className="tip">
                    <h3>✨ 알아두면 좋은 점</h3>
                    <ul>
                        <li><strong>소요 시간:</strong> 메일 양에 따라 가져오기 작업은 몇 시간에서 최대 2일까지 걸릴 수 있습니다.</li>
                        <li><strong>2단계 인증:</strong> OTP 등 2단계 인증을 사용한다면, 네이버에서 '앱 비밀번호'를 발급받아 사용해야 할 수 있습니다.</li>
                    </ul>
                </div>
            </div>

        </div>)

}

export default HowToMailConnect;