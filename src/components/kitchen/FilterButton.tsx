import Image from "next/image";
import { useState } from "react";
import colors from "../../assets/styles";
import { FilterType } from "../../pages/kitchen/filter";

interface FilterButtonProps {
  filter: FilterType;
  clickFilter: any;
  clicked: boolean | undefined;
}
export default function FilterButton({
  filter,
  clickFilter,
  clicked,
}: FilterButtonProps) {
  const [selected, setSelected] = useState(clicked);
  return (
    <>
      <div className="container">
        <div
          key={filter.id}
          onClick={() => {
            setSelected(!selected);
            clickFilter(selected, filter);
          }}
          className={selected ? "selected" : "not-selected"}
        >
          <div className="icon">
            <Image
              src={selected ? filter.image_selected : filter.image}
              alt={"icon"}
              width={48}
              height={48}
            />
          </div>
          <div className={"name"}>{filter.name}</div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 83px;
          text-align: center;
          margin: 15px 0px;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .selected .icon {
          border-radius: 100%;
          border: 1px solid ${colors.mainOrange};
          color: white;
        }
        .not-selected .icon {
          border: 1px solid ${colors.grayWhite};
          color: black;
        }

        .name {
          margin-top: 4px;
        }
        .selected .name {
          color: ${colors.mainOrange};
        }
        .not-selected .name {
          color: ${colors.graySubTitle};
        }
      `}</style>
    </>
  );
}
