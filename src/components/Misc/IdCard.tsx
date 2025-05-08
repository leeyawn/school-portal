import defaultProfileImage from '../../assets/images/user-profile.jpg';
import { Card } from '../ui/card';

interface StudentInfo {
  firstName: string;
  lastName: string;
  studentId: string;
  photoUrl?: string;
}

interface IdCardProps {
  student: StudentInfo;
  className?: string;
}

const IdCard: React.FC<IdCardProps> = ({ student, className = '' }) => {
  const fullName = `${student.firstName} ${student.lastName}`;
  
  return (
    <div className={`flex justify-center items-center w-full h-full p-4 ${className}`}>
      <Card className="min-w-96 w-96 h-60 shadow-lg relative bg-blue-900">
        <div className="flex items-center p-3 ">
          <div className="absolute top-1">
            <h1 className="text-white text-2xl font-bold">SUNY</h1>
            <h2 className="text-white text-md font-semibold">POLYTECHNIC INSTITUTE</h2>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-yellow-300 font-bold">STUDENT</h3>
          <h2 className="text-white text-2xl font-bold">{fullName}</h2>
          <div className="flex justify-between">
            <div className="text-white">ID# {student.studentId}</div>
          </div>
        </div>
        
        <div className="absolute top-3 right-3 w-24 h-32 bg-blue-100 border-2 border-gray-300 overflow-hidden">
          {student.photoUrl ? (
            <img 
              src={student.photoUrl} 
              alt={`${fullName}'s photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={defaultProfileImage}
              alt={`${fullName}'s photo`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="absolute bottom-16 right-3">
          <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-30">
            <path 
              d="M10,50 L90,10 M10,60 L90,20 M10,70 L90,30 M10,80 L90,40 M10,90 L90,50" 
              stroke="white" 
              strokeWidth="1" 
            />
          </svg>
        </div>
      </Card>
    </div>
  );
};

export default IdCard;