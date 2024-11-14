import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";

import {
  statisticsCardsData} from "@/data";
  // statisticsChartsData,
  // projectsTableData,
  // ordersOverviewData,

import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Map from "./Map";
import DonutChart from "./DonutCharts";
import PolarAreaChart from "./PolarAreaChart";


export function Home() {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div> 
      
       <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3"><Card sx={{ maxWidth: 100, width: '100%', margin: 'auto', padding: 1, boxShadow: 2 }}>
  <DonutChart />
</Card>
 <Card >
        <PolarAreaChart/>
        </Card>     <Card >
      
        </Card>   </div> <Map/>
      
  

    </div>
  );
}

export default Home;
