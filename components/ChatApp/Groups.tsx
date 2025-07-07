import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../src/store";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../src/components/ui/alert-dialog";

// import {  RootState } from "../../src/store";
// import { useDispatch, useSelector } from "react-redux";
//import { setLogin } from "../../src/features/LoginSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;
// Defining the interface for the response data
interface REsp {
  group_name: string;
  created_by: number;
  group_ids: number;
  createdby_name?: string;
}

interface AccessRecord {
  access_id: number;
  user_id: number;
  group_id: number;
  is_deleted: number;
}

interface Group {
  group_id: number;
  group_name: string;
}

interface User {
  user_Id: number;
  username: string;
}

function Groups() {
  const navigate = useNavigate();
  const [resp, setResp] = useState<REsp[]>([]);
  const [creategroup, setcreategroup] = useState(false);
  const { register, watch, handleSubmit } = useForm();
  const crearedBY = useSelector((state: RootState) => state.login.userId);
  const [refetch, setrefetch] = useState(false);
  const [selectedgroupId, setGrupIs] = useState<number>();
  // const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.login.name);
  const [requestaccess, setrequestaccess] = useState(false);
  const [GrandAccess, setGrandaccess] = useState(false);
  const [accessData, setAccessData] = useState<AccessRecord[]>([]);
  const [accessDatas, setAccessDatas] = useState<AccessRecord[]>([]);
  const [refetchs, setrefetchs] = useState(false);
  // const userIdID=useSelector((state:RootState)=>state.login.userId);

  // Fetching data from the API when the component mounts
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getgroups`);
        const groupData: REsp[] = response?.data || [];

        const userIds = [...new Set(groupData.map((item) => item?.created_by))];

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

        // Enrich group data with username
        const enrichedData = groupData.map((item) => ({
          ...item,
          createdby_name: userMap[item.created_by] || "Unknown",
        }));

        setResp(enrichedData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroupData();
  }, [creategroup, refetch]);

  const onSubmit = () => {
    const data = {
      group_name: watch("name"),
      created_by: crearedBY,
    };
    axios
      .post(`${BASE_URL}/createGroup`, data)
      .then((response) => {
        if (response?.data.statuscode == 200) {
          // setrefetch(!refetch)
          setcreategroup(false);
        }
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  const DeleteGroup = (Id: number) => {
    axios.get(`${BASE_URL}/DeleteGroup?Id=${Id}`).then((response) => {
      if (response?.data?.statuscode == 200) {
        setrefetch(!refetch);
      }
    });
  };

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:7160/sse");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const datas: REsp = {
        group_name: data.group_name,
        created_by: data.created_by,
        group_ids: data.group_ids,
        createdby_name: data.createdby_name,
      };
      const userIds = datas.createdby_name;
      axios.post(`${BASE_URL}/getuserbyId`, userIds).then((response) => {
        const userList: User[] = response?.data || [];
        const userMap = userList.reduce((acc: Record<string, string>, user) => {
          acc[user.user_Id] = user.username;
          return acc;
        }, {});

        const orgdatas: REsp = {
          group_name: data.group_name,
          created_by: data.created_by,
          group_ids: data.group_ids,
          createdby_name: userMap[data.createdby_name],
        };
        // Enrich group data with username
        setResp((prev) => [...prev, orgdatas]);
      });

      // Create a map for quick access

      // if (Array.isArray(data.data)) {
      //   setResp(data.data); // overwrite existing messages
      // } else {
      //   setResp((prev) => [...prev, data.data]);
      // }

      // console.log("New message:", event.data);
    };

    return () => {
      eventSource.close(); // Terminate connection on component unmount
      console.log("SSE connection closed.");
    };
  }, []);

  const handlegroupREq = (groupId: number) => {
    axios
      .get(`${BASE_URL}/checkaccess?user_id=${crearedBY}&group_id=${groupId}`)
      .then((response) => {
        if (response?.data?.statuscode == 200) {
          navigate(`/chatpage/${groupId}`);
        } else {
          setGrupIs(groupId);
          setrequestaccess(true);
        }
      });
  };

  const handleRequest = () => {
    const data = {
      user_id: crearedBY,
      group_id: selectedgroupId,
    };
    axios.post(`${BASE_URL}/requestaccess`, data).then((response) => {
      if (response?.data?.statuscode == 200) {
        toast.success("Successfully  request sent"); // Success toast
        setrequestaccess(false);
        setrefetchs(!refetchs);
      } else {
        toast.error(response?.data?.message);
        setrequestaccess(false);
      }
    });
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}/GetRequests?userId=${crearedBY}`)
      .then(async (response) => {
        const Users = response?.data;
        setAccessDatas(Users);
        const userIds = Users?.map((item: AccessRecord) => item?.user_id);
        const groupIds = Users?.map((item: AccessRecord) => item?.group_id);

        const [userRes, groupRes] = await Promise.all([
          axios.post(`${BASE_URL}/getuserbyId`, userIds),
          axios.post(`${BASE_URL}/getgroupbyId`, groupIds),
        ]);

        const UserDatas: User[] = userRes?.data;
        const GroupDatas: Group[] = groupRes?.data;

        // Replace user_id and group_id with names
        const OrgUsers = Users?.map((item: AccessRecord) => {
          const username = UserDatas?.find(
            (u) => u.user_Id === item.user_id
          )?.username;
          const groupName = GroupDatas?.find(
            (g) => g.group_id === item.group_id
          )?.group_name;

          return {
            ...item,
            user_id: username,
            group_id: groupName,
          };
        });

        setAccessData(OrgUsers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refetchs]);

  const handleApprove = (Id: number) => {
    const selectedData = accessDatas?.find((item) => item.access_id == Id);
    const data = {
      user_id: selectedData?.user_id,
      group_id: selectedData?.group_id,
      is_deleted: 1,
    };
    axios.post(`${BASE_URL}/grandaccess`, data).then((response) => {
      if (response?.data?.statuscode == 200) {
        toast.success("Success");
        setrefetchs(!refetchs);
      } else {
        return;
      }
    });
  };
  const handleRemove = (Id: number) => {
    const selectedData = accessDatas?.find((item) => item.access_id == Id);
    const data = {
      user_id: selectedData?.user_id,
      group_id: selectedData?.group_id,
      is_deleted: 2,
    };
    axios.post(`${BASE_URL}/grandaccess`, data).then((response) => {
      if (response?.data?.statuscode == 200) {
        toast.success("Success");
        setrefetchs(!refetchs);
      } else {
        return;
      }
    });
  };


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    axios
      .get("http://localhost:8090/getusers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response,"aaaaaaa")
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center py-10 px-4 sm:px-8">
      <ToastContainer />




      {/* Welcome Banner */}
      <div className="fixed top-4 right-4 bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md z-50">
        <p className="text-sm font-semibold">Welcome, {username || "Guest"}!</p>
      </div>
      {
  users?.map((item)=>(
    <div className="bg-yellow-400 w-full h-11 text-wrap">
      {item?.name}
      </div>
  ))
}

      {/* Grant Access Modal */}
      {GrandAccess && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative">
            <div className="flex justify-between items-center text-gray-700 font-semibold border-b pb-2 mb-4">
              <span>User</span>
              <span>Group</span>
              <span>
                <button
                  className="absolute top-3 right-3 text-xl font-bold text-red-600 hover:text-red-800"
                  onClick={() => setGrandaccess(false)}
                >
                  &times;
                </button>
              </span>
            </div>
            {accessData.length > 0 ? (
              accessData.map((item) => (
                <div
                  key={item.access_id}
                  className="flex justify-between items-center py-3 border-b last:border-none text-gray-800"
                >
                  <span>{item.user_id}</span>
                  <span>{item.group_id}</span>
                  <div className="flex space-x-3">
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleRemove(item.access_id)}
                    >
                      ✖
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 transition"
                      onClick={() => handleApprove(item.access_id)}
                    >
                      ✔
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No Requests available</p>
            )}
          </div>
        </div>
      )}

      {/* Request Access Modal */}
      {requestaccess && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-sm">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full transition"
              onClick={() => handleRequest()}
            >
              Request Access
            </button>
            <button
              onClick={() => setrequestaccess(false)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {creategroup && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => setcreategroup(false)}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-600"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <p className="text-lg font-semibold text-gray-700">
                Create Group
              </p>
              <input
                {...register("name")}
                className="w-full p-4 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter Group Name"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-10 px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 sm:mb-0">
          Available Chats
        </h1>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate("/trialcheck")} className="text-white">
            Fortess
          </button>
          <button onClick={() => navigate("/xogame")} className="text-white">
            Fun Time
          </button>
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/mygroups")}
          >
            View My Groups
          </button>
          <button
            onClick={() => setGrandaccess(true)}
            className="px-5 py-2 border border-blue-600 text-white rounded-lg hover:bg-blue-100 transition"
          >
            Join Requests
          </button>
          <button
            onClick={() => setcreategroup(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {resp.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full text-center">
            No groups available.
          </p>
        ) : (
          resp.map((group, index) => (
            <div key={index} className="relative">
              {group.created_by === parseInt(crearedBY) && (
                <AlertDialog>
                  <AlertDialogTrigger className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700 z-10">
                    ✖
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Group?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-white hover:text-white hover:text-9xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => DeleteGroup(group.group_ids)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <div
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => handlegroupREq(group.group_ids)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {group.group_name}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Created by User:{" "}
                  <span className="font-medium">{group.createdby_name}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Groups;
