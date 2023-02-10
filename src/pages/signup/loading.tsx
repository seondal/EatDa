import { useRouter } from "next/router";
import { CTA1Button } from "../../components/common/Button";
import { selectUser } from "../../store/userSlice";
import { selectSurvey } from "../../store/surveySlice";
import { putToken } from "../../store/tokenSlice";
import { login } from "../../store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import colors from "../../assets/styles";
import { route } from "../../assets/route";
import Image from "next/image";
import { illust } from "../../assets/illust";

interface bodyDataI {
  social_id: string;
  email: string;
  name: string;
  character: number;
  group: string;
  is_diabetes: boolean | null;

  height?: number;
  weight?: number;
  age?: number;
  gender?: string | null;
  activity?: number | null;
  allergy?: string[] | null;
}

export default function Loading() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const survey = useSelector(selectSurvey);

  const [page, setPage] = useState<number>(0);

  const handleClick = () => {
    router.replace(route.home);
  };

  const fetchSignup = async () => {
    const URL = `${process.env.NEXT_PUBLIC_API_ROOT}accounts/register/`;
    let bodyData: bodyDataI = {
      social_id: user.usersocial_id,
      // social_id: '7',
      email: user.useremail,
      // email: '7@gmail.com',
      name: user.username,
      character: user.usercharacter,
      group: user.usergroup,
      is_diabetes: user.isDiabetes,
    };
    if (user.isDiabetes) {
      // 당뇨인일 때 설문조사 정보 추가
      console.log("survey:", survey);
      bodyData.height = survey.height;
      bodyData.weight = survey.weight;
      bodyData.age = survey.age;
      bodyData.gender = survey.gender;
      bodyData.activity = survey.activity;
      bodyData.allergy = survey.allergy;
    }
    try {
      console.log("bodyData:", JSON.stringify(bodyData));

      const data = await fetch(URL, {
        method: "POST",
        credentials: "include",
        // mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const res = await data.json();

      return { data, res };
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data, res }: any = await fetchSignup();
      if (data.ok) {
        setTimeout(() => {
          setPage(1);
        }, 1000);
        console.log(res);
        const reduxData = {
          usersocial_id: user.usersocial_id,
          useremail: user.useremail,
          username: user.username,
          usercharacter: res.user_info.character,
          isDiabetes: res.user_info.is_diabetes,
          usergroup: user.usergroup,
        };
        dispatch(login(reduxData));
        dispatch(putToken({ access_token: res.access_token }));
        console.log("회원가입 완료");
      } else {
        console.log("회원가입 실패");
        console.log(res);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      {page === 0 ? (
        <div className="text">
          <div className="textHeader">
            <div className="textMain">{user.username} 님</div>만을 위한
          </div>
          <div className="textHeader">레시피를 준비 중이에요!</div>
          <Image
            alt="character"
            width={350}
            height={62}
            src={illust.loading}
            priority
          />
        </div>
      ) : (
        <div className="making">
          <div className="style">
            <Image
              alt="character"
              width={124}
              height={182}
              src={illust.loading_ch}
              priority
            />
            <div className="textHeader">
              건강한 맞춤 식사를 <br />
              만들 준비가 되셨나요?
            </div>
          </div>
          <div className="buttonItem">
            <CTA1Button
              active={true}
              text="식단 만들러 가기"
              onClick={handleClick}
            />
          </div>
        </div>
      )}
      <style jsx>{`
        .style {
          margin-bottom: 50px;
        }
        .making {
          margin: -30px -20px -90px -20px;
          width: 390px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-image: url(${illust.signup_background});
          background-size: auto;
          background-position: center;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // min-height: 500px;
          margin-top: -100px;
          height: 100vh;
        }
        .textHeader {
          text-align: center;
          display: flex;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }
        .textMain {
          text-align: center;
          color: ${colors.mainOrange};
        }
        .text {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }
        .buttonItem {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          position: fixed;
          bottom: 36px;
          left: 0;
          right: 0;
        }
      `}</style>
    </div>
  );
}
