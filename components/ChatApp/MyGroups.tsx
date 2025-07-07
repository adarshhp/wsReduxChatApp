import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../src/store";
import { saveGroup } from "../../src/features/MyGroupsSlice";
import { AddUsers } from "../../src/features/GroupUserSlice";
import { toast, ToastContainer } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;
interface REsp {
  group_name: string;
  created_by: number;
  group_ids: number;
  createdby_name?: string;
}
interface filtereduser {
  id: number;
  name: string;
}
interface User {
  user_Id: number;
  username: string;
}

const MyGroups = () => {
  const crearedBY = useSelector((state: RootState) => state.login.userId);
  const GroupsByUser = useSelector((state: RootState) => state.mygroup.value);
  const GroupMembers = useSelector(
    (state: RootState) => state.groupusers.value
  );
  const [groupid, setgroupid] = useState<number>();
  const [openview,setopenview]=useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      axios.get(`${BASE_URL}/getgroups`).then(async (response) => {
        const orgGroups = response?.data?.filter(
          (item: REsp) => item.created_by.toString() == crearedBY
        );

        const userIds = [
          ...new Set(orgGroups.map((item: REsp) => item?.created_by)),
        ];

        // Fetch user details for the collected userIds
        const userResponse = await axios.post(
          `${BASE_URL}/getuserbyId`,
          userIds
        );
        const userList: User[] = userResponse?.data || [];

        // Create a map for quick access
        const userMap = userList.reduce((acc: Record<string, string>, user) => {
          acc[user.user_Id] = user.username;
          return acc;
        }, {});

        const enrichedData = orgGroups.map((item: REsp) => ({
          ...item,
          createdby_name: userMap[item.created_by] || "Unknown",
        }));

        dispatch(saveGroup(enrichedData));
      });
    } catch (err) {
      console.log(err);
    }
  }, []);



  const handleview = (i: number) => {
    setopenview(true);
    setgroupid(i);
    axios.get(`${BASE_URL}/getusersbygroupId?groupId=${i}`).then((response) => {
      const Users = response?.data?.users?.filter(
        (item: filtereduser) => item.id != parseInt(crearedBY)
      );
      dispatch(AddUsers(Users));
    });
  };

  // const Dispatch = () => {
  //   dispatch(clearGroup());
  // };

  const handleRemove = (i: number) => {
    const data = {
      user_id: i,
      group_id: groupid,
      is_deleted: 2,
    };
    axios.post(`${BASE_URL}/grandaccess`, data).then((response) => {
      if (response?.data?.statuscode == 200) {
        handleview(i)
        toast.success("User Removed");
      }
    });
  };

  return (
    <div className="relative w-full min-h-screen px-4 py-6 bg-gray-50">
      <ToastContainer />

      {openview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-md text-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              Group Participants
            </p>
{GroupMembers.length==0&&(<div>No Users in this chat</div>)}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {GroupMembers.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow-sm"
                >
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setopenview(false)}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <p className="text-3xl font-bold text-gray-700 mb-6 border-b pb-2 w-full flex justify-center">
        My Groups
      </p>

      <div className="space-y-4">
        {GroupsByUser.map((item: REsp) => (
          <div key={item.group_ids} className="flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center hover:shadow-lg transition">
              <span className="text-lg font-medium text-gray-800">
                {item.group_name}
              </span>
              <button
                onClick={() => handleview(item.group_ids)}
                className="w-full md:w-fit px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold rounded-md text-sm transition"
              >
                View Participants
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
