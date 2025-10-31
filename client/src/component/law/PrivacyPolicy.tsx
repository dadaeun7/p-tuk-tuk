import { useNavigate } from "react-router-dom";
import "../../css/privacy-policy.css";

export type PrivacyContacts = {
  name: string;
  title: string;
  phone: string;
  email: string;
};

export interface PrivacyPolicyProps {
  serviceName?: string;
  effectiveDate?: string; // YYYY-MM-DD
  contacts?: PrivacyContacts;
}

const defaultContacts: PrivacyContacts = {
  name: "박다은",
  title: "대표",
  phone: "-",
  email: "dadaeun7@gmail.com",
};

export default function PrivacyPolicy({
  serviceName = "tuktuk",
  effectiveDate = "2025-08-12",
  contacts = defaultContacts,
}: PrivacyPolicyProps) {

  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const joinReturnBtn = () => {
    navigate(-1);
  }

  return (
    <div className="pp-root">
      <header>
        <div className="wrap">
          <span className="subtitle">{serviceName}</span>
          <h1 className="title">개인정보처리방침</h1>
          <div className="subtitle">시행일: <span>{effectiveDate}</span></div>
          <div className="return-join" onClick={joinReturnBtn}>[닫기]</div>
        </div>
      </header>

      <main className="wrap" role="main">
        <section className="card" id="intro" aria-labelledby="intro-title">
          <h2 id="intro-title">개요</h2>
          <p>
            <strong>{serviceName}</strong>(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 관리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다. 본 방침은 서비스 화면 하단에 상시 게시됩니다.
          </p>
        </section>

        <section className="card" id="purpose" aria-labelledby="purpose-title">
          <h2 id="purpose-title">1. 개인정보의 수집 및 이용 목적</h2>
          <ul>
            <li>
              <strong>회원가입 및 본인확인</strong>: 이메일 주소를 회원 아이디로 사용하며, 이메일 인증을 통해 가입 여부 확인
            </li>
            <li>
              <strong>서비스 제공</strong>: 로그인, 회원 식별, 서비스 이용 기록 관리 등 기본 서비스 제공
            </li>
            <li>
              <strong>(선택) 맞춤형 정보 제공</strong>: 사용자가 자발적으로 지역 정보를 설정한 경우, 해당 지역에 특화된 정보 제공
            </li>
          </ul>
        </section>

        <section className="card" id="items" aria-labelledby="items-title">
          <h2 id="items-title">2. 수집하는 개인정보 항목</h2>
          <table aria-describedby="items-desc">
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">수집 항목</th>
                <th scope="col">수집 시점</th>
                <th scope="col">필수/선택</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>회원가입</td>
                <td>이메일 주소</td>
                <td>회원가입 시(이메일 인증 포함)</td>
                <td>
                  <code className="badge" aria-label="필수 항목">
                    필수
                  </code>
                </td>
              </tr>
              <tr>
                <td>서비스 이용 중</td>
                <td>지역 정보(시/군/구)</td>
                <td>이용자가 설정 시</td>
                <td>
                  <code className="badge" aria-label="선택 항목">
                    선택
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
          <p id="items-desc" className="muted small">
            ※ 선택 항목은 사용자가 직접 설정하는 경우에만 수집하며, 설정하지 않아도 서비스 이용에는 제한이 없습니다.
          </p>
        </section>

        <section className="card" id="collection-method" aria-labelledby="collection-method-title">
          <h2 id="collection-method-title">3. 개인정보의 수집 방법</h2>
          <ul>
            <li>회원가입 화면에서 이용자가 직접 입력</li>
            <li>서비스 내 ‘지역 설정’ 기능을 통해 이용자가 선택 입력</li>
          </ul>
        </section>

        <section className="card" id="retention" aria-labelledby="retention-title">
          <h2 id="retention-title">4. 개인정보의 보유 및 이용 기간</h2>
          <ul>
            <li>
              <strong>이메일 주소</strong>: 회원 탈퇴 시 즉시 파기. 다만, 법령에 따라 일정 기간 보관이 필요한 경우 해당 법령에 따름
            </li>
            <li>
              <strong>지역 정보</strong>: 이용자가 삭제 또는 변경 요청 시 즉시 삭제
            </li>
          </ul>
        </section>

        <section className="card" id="third-party" aria-labelledby="third-party-title">
          <h2 id="third-party-title">5. 개인정보의 제3자 제공</h2>
          <p>회사는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 다음의 경우는 예외로 합니다.</p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따른 요청이 있는 경우</li>
          </ul>
        </section>

        <section className="card" id="outsourcing" aria-labelledby="outsourcing-title">
          <h2 id="outsourcing-title">6. 개인정보 처리의 위탁</h2>
          <p>
            회자는 개인정보 처리 업무를 외부에 위탁하지 않습니다. (향후 위탁이 발생할 경우, 위탁받는 자와 위탁 업무 내용을 사전에 고지하고 동의를 받겠습니다.)
          </p>
        </section>

        <section className="card" id="rights" aria-labelledby="rights-title">
          <h2 id="rights-title">7. 이용자의 권리·의무 및 행사 방법</h2>
          <ul>
            <li>이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리정지 요청을 할 수 있습니다.</li>
            <li>권리 행사는 서비스 내 ‘내 정보’ 메뉴 또는 고객센터를 통해 가능합니다.</li>
            <li>회사는 이용자의 요청을 받은 경우 지체 없이 필요한 조치를 취합니다.</li>
          </ul>
        </section>

        <section className="card" id="destruction" aria-labelledby="destruction-title">
          <h2 id="destruction-title">8. 개인정보의 파기 절차 및 방법</h2>
          <ul>
            <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
            <li>인쇄물: 분쇄 또는 소각</li>
          </ul>
        </section>

        <section className="card" id="security" aria-labelledby="security-title">
          <h2 id="security-title">9. 개인정보의 안전성 확보 조치</h2>
          <ul>
            <li>
              <strong>암호화</strong>: 이메일 주소는 암호화하여 저장
            </li>
            <li>
              <strong>접근통제</strong>: 관리자 계정 접근 권한 최소화 및 접근 이력 관리
            </li>
            <li>
              <strong>보안 프로그램</strong>: 외부 침입 방지를 위한 보안 솔루션 운영
            </li>
          </ul>
        </section>

        <section className="card" id="cookies" aria-labelledby="cookies-title">
          <h2 id="cookies-title">10. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
          <p>
            회사는 쿠키(Cookie) 등 개인정보 자동수집 장치를 사용하지 않습니다. (추후 사용 시 별도 고지 및 동의 절차 진행)
          </p>
        </section>

        <section className="card" id="dpo" aria-labelledby="dpo-title">
          <h2 id="dpo-title">11. 개인정보 보호책임자</h2>
          <div className="meta-grid small">
            <div>
              <strong>성명</strong>: <span className="muted">{contacts.name}</span>
            </div>
            <div>
              <strong>직책</strong>: <span className="muted">{contacts.title}</span>
            </div>
            <div>
              <strong>연락처</strong>: <span className="muted">{contacts.phone}</span>
            </div>
            <div>
              <strong>이메일</strong>: <span className="muted">{contacts.email}</span>
            </div>
          </div>
          <p className="small muted">※ 개인정보 보호 관련 문의는 위 연락처로 해주시기 바랍니다.</p>
        </section>

        <section className="card" id="remedy" aria-labelledby="remedy-title">
          <h2 id="remedy-title">12. 권익침해 구제방법</h2>
          <ul>
            <li>
              개인정보침해신고센터: (국번없이) 118 /
              <a href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer noopener">
                https://privacy.kisa.or.kr
              </a>
            </li>
            <li>
              개인정보분쟁조정위원회: (국번없이) 1833-6972 /
              <a href="https://www.kopico.go.kr" target="_blank" rel="noreferrer noopener">
                https://www.kopico.go.kr
              </a>
            </li>
          </ul>
        </section>

        <section className="card" id="change" aria-labelledby="change-title">
          <h2 id="change-title">13. 개인정보처리방침의 변경</h2>
          <p>본 방침 내용의 추가, 삭제 및 수정이 있을 경우, 개정 최소 7일 전부터 공지사항을 통해 고지합니다.</p>
          <p className="small muted">시행일: <strong>{effectiveDate}</strong></p>
        </section>

        <section className="card" id="notes" aria-labelledby="notes-title">
          <h2 id="notes-title">부가 안내</h2>
          <ul className="small">
            <li>이메일은 로그인 및 서비스 식별 외의 목적으로 사용하지 않습니다.</li>
            <li>지역 정보는 선택 항목으로, 설정하지 않아도 서비스 이용에 제한이 없습니다.</li>
          </ul>
        </section>
      </main>

      <footer>
        <div className="wrap small">
          <p>&copy; {year} {serviceName}. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
