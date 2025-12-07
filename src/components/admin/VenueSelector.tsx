import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUserTenants } from '@/types/IUserTenants';
import { useRouter } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VenueSelectorProps {
	userTenants: IUserTenants[];
	tenant: string;
}

export default function VenueSelector({ userTenants, tenant }: VenueSelectorProps) {
	const router = useRouter();
	const t = useTranslations('admin');
	
	const handleTenantChange = (value: string) => {
		if (value === 'add-new') {
			router.push('/onboarding');
		} else {
			router.push(`/${value}/admin/dashboard`);
		}
	}
	
	return (
		<Select
			value={tenant}
			onValueChange={handleTenantChange}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select venue" />
			</SelectTrigger>
			<SelectContent>
				{userTenants.map((tenant) => (
					<SelectItem key={tenant.id} value={tenant.slug}>{tenant.name}</SelectItem>
				))}
				<SelectItem 
					value="add-new"
					className="text-primary font-medium border-t mt-1 pt-2"
				>
					<div className="flex items-center">
						<Plus className="mr-2 h-4 w-4" />
						{t('addVenue')}
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

